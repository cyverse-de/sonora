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
    open.then(function(conn) {
        logger.info("*************amqp connection created****************");
        connection = conn;
        process.once("SIGINT", conn.close.bind(conn));
        return conn.createChannel();
    })
        .then(function(channel) {
            msgChannel = channel;
            return channel;
        })
        .catch((exception) => {
            logger.error("Amqp error: " + exception);
            if (connection) {
                logger.info("!!!!!!!!!!!!Closing amqp connection!!!!!!!!!");
                connection.close();
            }
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
    if (!user) {
        logger.error("User not found. Unable to get notification!");
    }
    const QUEUE = NOTIFICATION_QUEUE + user;
    if (msgChannel) {
        msgChannel.assertQueue(QUEUE);
        msgChannel.bindQueue(
            QUEUE,
            config.amqpExchangeName,
            NOTIFICATION_ROUTING_KEY + user
        );
        logger.info("Channel bound for user " + user);
        msgChannel.consume(
            QUEUE,
            function(msg) {
                logger.info("Received message:" + msg.content.toString());
                waitForSocketConnection(ws, function() {
                    ws.send(msg.content.toString());
                    console.log("message sent!!!");
                });
            },
            {
                noAck: true,
            }
        );
    } else {
        logger.error("No channel found");
    }
}

/**
 *
 * Make the websocket.send wait until the connection is made...
 *
 * @param {Object} socket - Websocket instance
 * @param {function} callback - Function callback when websocket connection is made.
 */
function waitForSocketConnection(socket, callback) {
    setTimeout(function() {
        if (socket.readyState === 1) {
            logger.info("Websocket connection is open...");
            if (callback != null) {
                callback();
            }
        } else {
            logger.info("waiting for websocket connection...");
            waitForSocketConnection(socket, callback);
        }
    }, 5); // wait 5 ms for the connection...
}
