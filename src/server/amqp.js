/**
 *
 * @author sriram
 *
 */

import amqplib from "amqplib";
import * as config from "./configuration";
import logger from "./logging";

const NOTIFICATION_ROUTING_KEY = "notification.";
const NOTIFICATION_QUEUE = "de_notifications.";

let connection, msgChannel;

/**
 *
 * Connect to amqp and return a channel
 *
 */
export function setUpAmqpForNotifications() {
    logger.info("Connecting to amqp...");
    const open = amqplib.connect(config.amqpUri);
    open.then(function (conn) {
        logger.info("*************amqp connection created****************");
        connection = conn;
        process.once("SIGINT", conn.close.bind(conn));
        return conn.createChannel();
    })
        .then(function (channel) {
            msgChannel = channel;
            return channel;
        })
        .catch((exception) => {
            logger.error("Amqp error: " + exception);
            if (connection) {
                logger.info("!!!!!!!!!!!!Closing amqp connection!!!!!!!!!");
                connection.close();
            }
            logger.info("Attempting to reconnect to amqp...");
            setUpAmqpForNotifications();
        });
}

/**
 *
 * Consume notifications from AMQP and write it back to websocket
 *
 * @param {string} user - CyVerse Username
 * @param {Object} ws - Websocket instance
 * @param {Object} wss - Websocket handler
 */
export function getNotifications(user, ws, wss) {
    let consumerTag = "";
    if (!user) {
        logger.error("User not found. Unable to get notifications!");
        ws.close();
        return;
    }

    // Tag the websocket with the current user's id
    ws.userId = user;

    const QUEUE = NOTIFICATION_QUEUE + user;

    const connectionCleanUp = () => {
        msgChannel.unbindQueue(
            QUEUE,
            config.amqpExchangeName,
            NOTIFICATION_ROUTING_KEY + user
        );
        msgChannel.cancel(consumerTag);
        logger.info(
            "Websocket closed. Channel unbound for user: " +
                user +
                " consumer Tag:" +
                consumerTag
        );
    };

    ws.on("close", function () {
        connectionCleanUp();
    });

    ws.on("error", function (error) {
        logger.info("Websocket error: " + error);
        connectionCleanUp();
    });

    if (msgChannel) {
        msgChannel.assertQueue(QUEUE);
        msgChannel.bindQueue(
            QUEUE,
            config.amqpExchangeName,
            NOTIFICATION_ROUTING_KEY + user
        );
        logger.info("Channel bound for user: " + user);
        msgChannel
            .consume(
                QUEUE,
                function (msg) {
                    logger.info("Received message:" + msg.content.toString());
                    try {
                        // Cycle through the client connections and send
                        // ws notifications to each client containing the
                        // matching userId tag
                        wss.clients.forEach(function each(client) {
                            if (user === client?.userId) {
                                client.send(msg.content.toString());
                            }
                        });
                        msgChannel.ack(msg);
                    } catch (e) {
                        logger.error("Error when sending message: " + e);
                        msgChannel.nack(msg);
                    }
                },
                {
                    noAck: false,
                }
            )
            .then((tag) => {
                logger.info(
                    "Consumer Tag is: " +
                        tag?.consumerTag +
                        " for user: " +
                        user
                );
                consumerTag = tag?.consumerTag;
            });
    } else {
        logger.error("No channel found");
    }
}
