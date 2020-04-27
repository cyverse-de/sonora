/**
 * @author Sriram
 *
 * A context for providing notification updates to components
 *
 */

import React from "react";

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
    const [notifications, setNotifications] = React.useState({
        connection: null,
        message: null,
    });
    const value = React.useMemo(() => [notifications, setNotifications], [
        notifications,
    ]);
    return <NotificationsContext.Provider value={value} {...props} />;
}

export { NotificationsProvider, useNotifications };
