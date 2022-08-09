/**
 * Notifications listing page
 *
 * @author psarando
 */
import React from "react";

import NotificationsListing from "components/notifications/listing";

export default function Notifications() {
    return <NotificationsListing baseDebugId="notifications" />;
}

Notifications.getInitialProps = async () => ({
    namespacesRequired: ["notifications"],
});
