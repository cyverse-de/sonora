/**
 *
 * @author sriram
 *
 */

import * as http from "http";
import * as ws from "ws";
import amqplib from "amqplib";
import UUID from "uuid/v4";

import NavigationConstants from "../common/NavigationConstants";
import * as authn from "./auth";
import * as config from "./configuration";
import logger from "./logging";

const NOTIFICATION_ROUTING_KEY = "notification.";
const NOTIFICATION_QUEUE = "de_notifications.";

let connection, msgChannel;

// From https://github.com/raimohanska/next-websockets-hmr-error-repro/blob/1b7d32680d3e77c755b76e633c9ccdf8009b230d/server/server.ts#L41-L45:
// Use `noServer` here to avoid creating a new HTTP server,
// or capturing all WebSocket upgrades of an existing one.
const wss = new ws.Server({
    noServer: true,
    path: NavigationConstants.NOTIFICATION_WS,
});

export const upgradeListener = (expressServer) => (req, socket, head) => {
    // Only handle WebSocket upgrades for the NOTIFICATION_WS path.
    if (req.url === NavigationConstants.NOTIFICATION_WS) {
        // The following based on
        // https://gist.github.com/porsager/eb754973e9e1c43842ca9c04001236d8
        const res = new http.ServerResponse(req);
        res.assignSocket(socket);
        res.on("finish", () => {
            logger.info("WEBSOCKET Finished, destroying...");
            res.socket.destroy();
        });

        req.ws = true;
        res.ws = (callback) => wss.handleUpgrade(req, socket, head, callback);

        expressServer(req, res);
    }
};

export const notificationsHandler = (req, res) => {
    // Only handle requests with a callback setup by the upgradeListener.
    if (req.ws) {
        res.ws((ws) => {
            logger.info("WEBSOCKET Connected for Notifications.");
            getNotifications(authn.getUserID(req), ws);
        });
    }
};

/**
 *
 * Connect to amqp and return a channel
 *
 */
export function setUpAmqpForNotifications() {
    logger.info("AMQP Connecting...");
    const open = amqplib.connect(config.amqpUri);
    open.then(function (conn) {
        logger.info("*************AMQP connection created****************");
        connection = conn;
        process.once("SIGINT", conn.close.bind(conn));
        return conn.createChannel();
    })
        .then(function (channel) {
            msgChannel = channel;
            return channel;
        })
        .catch((exception) => {
            logger.error("AMQP error: " + exception);
            if (connection) {
                logger.info("!!!!!!!!!!!!AMQP Closing connection!!!!!!!!!");
                connection.close();
            }
            logger.info("AMQP Attempting to reconnect...");
            setUpAmqpForNotifications();
        });
}

/**
 *
 * Consume notifications from AMQP and write it back to websocket
 *
 * @param {string} user - CyVerse Username
 * @param {Object} ws - Websocket instance
 */
export function getNotifications(user, ws) {
    let consumerTag = "";
    if (!user) {
        logger.error("WEBSOCKET User not found. Unable to get notifications!");
        ws.close();
        return;
    }

    const QUEUE = NOTIFICATION_QUEUE + user + "." + UUID();

    const connectionCleanUp = () => {
        msgChannel?.cancel(consumerTag);
        logger.info(
            "WEBSOCKET Closed. Consumer canceled for user: " +
                user +
                " consumer Tag: " +
                consumerTag +
                " queue name: " +
                QUEUE
        );
    };

    ws.on("close", function () {
        connectionCleanUp();
    });

    ws.on("error", function (error) {
        logger.info("WEBSOCKET error: " + error);
        connectionCleanUp();
    });

    if (msgChannel) {
        msgChannel.assertQueue(QUEUE, { exclusive: true, autoDelete: true });
        msgChannel.bindQueue(
            QUEUE,
            config.amqpExchangeName,
            NOTIFICATION_ROUTING_KEY + user
        );
        logger.info("AMQP Channel bound for user: " + user);
        msgChannel
            .consume(
                QUEUE,
                function (msg) {
                    logger.info(
                        "AMQP Received message:" + msg.content.toString()
                    );
                    try {
                        ws.send(msg.content.toString());
                        msgChannel.ack(msg);
                    } catch (e) {
                        logger.error(
                            "WEBSOCKET Error when sending message: " + e
                        );
                        msgChannel.nack(msg);
                    }
                },
                {
                    noAck: false,
                }
            )
            .then((tag) => {
                logger.info(
                    "AMQP Consumer Tag is: " +
                        tag?.consumerTag +
                        " for user: " +
                        user
                );
                consumerTag = tag?.consumerTag;
            });
    } else {
        logger.error("AMQP No channel found");
    }
}
