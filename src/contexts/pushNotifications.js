/**
 * @author Sriram
 *
 * A context for providing notification updates to components
 *
 */

import React, { useCallback, useEffect, useRef } from "react";
import constants from "../constants";
import NavigationConstants from "../common/NavigationConstants";
import Sockette from "sockette";
import { useUserProfile } from "./userProfile";

const NotificationsContext = React.createContext();

/**
 *  A hook that returns state for obtaining push notification messages
 *  and for saving and obtaining websocket connection info
 *
 *
 */

function useNotifications() {
    const context = React.useContext(NotificationsContext);
    if (!context) {
        throw new Error(
            `useNotifications must be used within a NotificationsProvider`
        );
    }
    return context;
}

/**
 * A React component that wraps its descendants in notifications context providers,
 * allowing them to get push notifications
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function NotificationsProvider(props) {
    const [userProfile] = useUserProfile();
    const [notifications, setNotifications] = React.useState();
    const value = React.useMemo(() => [notifications, setNotifications], [
        notifications,
    ]);
    const onMessage = useCallback(
        (event) => {
            console.log(event.data);
            setNotifications(event.data);
        },
        [setNotifications]
    );
    const wsConn = useRef(null);
    useEffect(() => {
        if (userProfile?.id && !wsConn.current) {
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
                    wsConn.current = ws;
                },
                onmessage: onMessage,
            });
        }
        return () => {
            setNotifications(null);
        };
    }, [notifications, userProfile, onMessage, wsConn]);

    useEffect(() => {
        if (!userProfile && wsConn.current) {
            wsConn.current.close();
        }
    }, [userProfile]);

    return <NotificationsContext.Provider value={value} {...props} />;
}

export { NotificationsProvider, useNotifications };
