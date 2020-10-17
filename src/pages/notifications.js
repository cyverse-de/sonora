/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return (
        <NotificationsListing
            baseDebugId="notifications"
            onMessageClicked={(message) =>
                // TODO handle navigation to other pages
                console.log("onMessageClicked", message)
            }
        />
    );
}

Notifications.getInitialProps = async () => ({
    namespacesRequired: ["notifications"],
});
