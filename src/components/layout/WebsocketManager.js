/**
 * @author Sriram
 *
 * A component that manages websocket connection to get notification messages.
 * Works with pushNotifications context to update consumers when there is a
 * new message.
 */

import React from "react";
import constants from "../../constants";
import NavigationConstants from "../../common/NavigationConstants";
import Sockette from "sockette";
import { useNotifications } from "../../contexts/pushNotifications";

export default function WebsocketManager() {
    const [notifications, setNotifications] = useNotifications();
    React.useEffect(() => {
        if (!notifications.connection) {
            let location = window.location;
            let protocol =
                location.protocol.toLowerCase() === "https:"
                    ? constants.WSS_PROTOCOL
                    : constants.WS_PROTOCOL;
            let host = location.hostname;
            let port = location.port;
            const notificationUrl =
                protocol +
                host +
                (port ? ":" + port : "") +
                NavigationConstants.NOTIFICATION_WS;
            console.log("Connecting websocket to " + notificationUrl);
            const ws = new Sockette(notificationUrl, {
                maxAttempts: 10,
                onopen: (e) => {
                    console.log("Websocket connected!");
                    setNotifications({ connection: ws, message: {} });
                },
                onmessage: (e) => {
                    console.log(e.data);
                    const savedConnection = notifications.connection;
                    setNotifications({
                        connection: savedConnection,
                        message: e.data,
                    });
                },
                onreconnect: (e) => console.log("Websocket Reconnecting...", e),
                onmaximum: (e) => console.log("Websocket Stop Attempting!", e),
                onclose: (e) => console.log("Websocket Closed!", e),
                onerror: (e) => console.log("Websocket Error:", e),
            });
        } else {
            console.log("reusing connection: " + notifications.connection);
        }
    }, [notifications, setNotifications]);

    return <div />;
}
