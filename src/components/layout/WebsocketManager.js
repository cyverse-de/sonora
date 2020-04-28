/**
 * @author Sriram
 *
 * A component that manages websocket connection to get notification messages.
 * Works with pushNotifications context to update consumers when there is a
 * new message.
 */

import React, { useCallback } from "react";
import constants from "../../constants";
import NavigationConstants from "../../common/NavigationConstants";
import Sockette from "sockette";
import { useNotifications } from "../../contexts/pushNotifications";

export default function WebsocketManager() {
    const [notifications, setNotifications] = useNotifications();

    const onOpen = useCallback(
        (ws) => {
            console.log("Websocket connected!");
            setNotifications({ connection: ws, message: {}, connected: true });
        },
        [setNotifications]
    );
    const onMessage = useCallback(
        (event) => {
            console.log(event.data);
            setNotifications({
                ...notifications,
                message: event.data,
            });
        },
        [setNotifications, notifications.connection]
    );

    React.useEffect(() => {
        if (!notifications.connected) {
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
                onopen: (e) => onOpen(ws),
                onmessage: onMessage,
                onclose: (e) =>
                    setNotifications({ ...notifications, connected: false }),
            });
        } else {
            console.log("reusing connection: " + notifications.connection);
        }
    }, [
        notifications,
        setNotifications,
        onMessage,
        onOpen,
        notifications.connected,
    ]);

    return <div />;
}
