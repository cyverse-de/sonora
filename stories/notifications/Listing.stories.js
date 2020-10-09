import React from "react";

import { mockNotificationsListing } from "./NotificationMocks";

import NotificationsListing from "components/notifications/listing";

export const Listing = () => {
    return (
        <NotificationsListing
            baseDebugId="notificationsListing"
            onMessageClicked={(message) =>
                console.log("onMessageClicked", message)
            }
            getNotifications={(
                rowsPerPage,
                offset,
                filter,
                order,
                onSuccess,
                onError
            ) => {
                console.log(
                    "getNotifications",
                    rowsPerPage,
                    offset,
                    filter,
                    order
                );
                setTimeout(
                    () =>
                        onSuccess(
                            mockNotificationsListing,
                            parseInt(mockNotificationsListing.total)
                        ),
                    2000
                );
            }}
            onMarkAsSeenClicked={(selected, onSuccess) => {
                console.log("onMarkAsSeenClicked", selected);
                setTimeout(onSuccess, 2000);
            }}
            deleteNotifications={(selected, onSuccess) => {
                console.log("deleteNotifications", selected);
                setTimeout(onSuccess, 2000);
            }}
        />
    );
};

export default { title: "Notifications" };
