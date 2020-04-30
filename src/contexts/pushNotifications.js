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
    //Saving websocket connection in ref will
    // Allow websocket connection be cached between component unmounts.
    const wsConn = useRef(null);
    useEffect(() => {
        if (userProfile?.id && !wsConn.current) {
            const location = window.location;
            const protocol =
                location.protocol.toLowerCase() === "https:"
                    ? constants.WSS_PROTOCOL
                    : constants.WS_PROTOCOL;
            const host = location.hostname;
            const port = location.port;
            const notificationUrl =
                protocol +
                host +
                (port ? ":" + port : "") +
                NavigationConstants.NOTIFICATION_WS;
            console.log("Connecting websocket to " + notificationUrl);
            const ws = new Sockette(notificationUrl, {
                maxAttempts: constants.WEBSOCKET_MAX_CONNECTION_ATTEMPTS,
                onopen: (e) => {
                    console.log("Websocket connected!");
                    wsConn.current = ws;
                },
                onmessage: onMessage,
            });
        }
        return () => {
            //without this, there will be dupe notification
            // when a component unmounts and remount
            //example, when switching between apps and data
            setNotifications(null);
        };
    }, [notifications, userProfile, onMessage, wsConn]);

    //when user logs out, close the websocket connection
    useEffect(() => {
        if (!userProfile && wsConn.current) {
            wsConn.current.close();
        }
    }, [userProfile]);

    return <NotificationsContext.Provider value={value} {...props} />;
}

export { NotificationsProvider, useNotifications };
