import amqplib from "amqplib";
import * as config from "./configuration";
import logger from "./logging";

const NOTIFICATION_ROUTING_KEY = "notification.sriram";
const notification_queue = "de_notifications";

export function setUpAmqpForNotifications() {
    let connection, msgChannel;
    logger.info("Connecting to amqp...");
    const open = amqplib.connect(config.amqpUri);
    open.then(function(conn) {
        logger.info("*************amqp connection created****************");
        connection = conn;
        return conn.createChannel();
    })
        .then(function(channel) {
            msgChannel = channel;
            channel.assertQueue(notification_queue);
            channel.bindQueue(
                notification_queue,
                config.amqpExchangeName,
                NOTIFICATION_ROUTING_KEY
            );
            channel.consume(
                notification_queue,
                function(msg) {
                    logger.info("Received message:" + msg.content.toString());
                },
                {
                    noAck: true,
                }
            );
            return channel;
        })
        .catch((exception) => {
            logger.error("Amqp error: " + exception);
            if (connection) {
                logger.info("Closing amqp connection");
                connection.close();
            }
        });
}
