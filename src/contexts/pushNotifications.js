/**
 * @author Sriram
 *
 * A context for providing notification updates to components
 *
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import constants from "../constants";
import NavigationConstants from "../common/NavigationConstants";
import Sockette from "sockette";
import { useUserProfile } from "./userProfile";
import AdminJoinTeamRequestDialog from "components/notifications/dialogs/AdminJoinTeamRequestDialog";
import JoinTeamDeniedDialog from "components/notifications/dialogs/JoinTeamDeniedDialog";
import {
    JOIN_TEAM_DENIED,
    REQUEST_TO_JOIN,
} from "components/notifications/utils";

const NotificationsContext = React.createContext();

/**
 *  A hook that returns state for obtaining push notification messages
 *  and for saving and obtaining websocket connection info
 *
 *  Also returns a function for setting a selected notification.  Depending
 *  on that notification's action, a couple different dialogs can open.
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
 * @param props.wsEnabled Allows websockets to be disabled when this context is
 *                        used in tests and stories.
 * @returns {*}
 * @constructor
 */
function NotificationsProvider(props) {
    const { children, wsEnabled = true } = props;
    const [userProfile] = useUserProfile();
    const [userId, setUserId] = useState(null);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [adminJoinRequestDlgOpen, setAdminJoinRequestDlgOpen] =
        useState(false);
    const [joinRequestDeniedDlgOpen, setJoinRequestDeniedDlgOpen] =
        useState(false);

    const value = React.useMemo(() => {
        return {
            currentNotification,
            setCurrentNotification,
            setSelectedNotification,
        };
    }, [currentNotification]);

    const onMessage = useCallback(
        (event) => {
            const data = event.data;
            console.log(data);

            let pushMsg = null;
            try {
                pushMsg = JSON.parse(data);
            } catch (e) {
                return;
            }
            setCurrentNotification(pushMsg);
        },
        [setCurrentNotification]
    );
    //Saving websocket connection in ref will
    // Allow websocket connection be cached between component unmounts.
    const wsConn = useRef(null);
    useEffect(() => {
        if (wsEnabled && userId && !wsConn.current) {
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
            const ws = new Sockette(notificationUrl, {
                maxAttempts: constants.WEBSOCKET_MAX_CONNECTION_ATTEMPTS,
                onopen: (e) => {
                    wsConn.current = ws;
                },
                onmessage: onMessage,
            });
        }
        return () => {
            //without this, there will be dupe notification
            // when a component unmounts and remount
            //example, when switching between apps and data
            setCurrentNotification(null);
        };
    }, [currentNotification, wsEnabled, userId, onMessage, wsConn]);

    //when user logs out, close the websocket connection
    useEffect(() => {
        if (!userProfile && wsConn.current) {
            wsConn.current.close();
        }
        setUserId(userProfile?.id);
    }, [userProfile]);

    useEffect(() => {
        if (selectedNotification) {
            const action = selectedNotification.payload?.action;
            if (action === REQUEST_TO_JOIN) {
                setAdminJoinRequestDlgOpen(true);
            }
            if (action === JOIN_TEAM_DENIED) {
                setJoinRequestDeniedDlgOpen(true);
            }
        } else {
            setAdminJoinRequestDlgOpen(false);
            setJoinRequestDeniedDlgOpen(false);
        }
    }, [selectedNotification]);

    return (
        <NotificationsContext.Provider value={value}>
            {children}
            <AdminJoinTeamRequestDialog
                open={adminJoinRequestDlgOpen}
                onClose={() => setAdminJoinRequestDlgOpen(false)}
                request={selectedNotification?.payload}
            />
            <JoinTeamDeniedDialog
                open={joinRequestDeniedDlgOpen}
                onClose={() => setJoinRequestDeniedDlgOpen(false)}
                adminMessage={selectedNotification?.payload?.admin_message}
                teamName={selectedNotification?.payload?.team_name}
            />
        </NotificationsContext.Provider>
    );
}

export { NotificationsProvider, useNotifications };
