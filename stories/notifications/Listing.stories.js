import React from "react";

import { mockAxios } from "../axiosMock";

import { mockNotificationsListing } from "./NotificationMocks";

import NotificationsListing from "components/notifications/listing";

const errorResponse = {
    error_code: "ERR_FALSE_ALARM",
    reason: "Nothing to see here... Please try again!",
};

export const Listing = () => {
    mockAxios.onGet(/\/api\/notifications\/messages*/).reply((config) => {
        console.log("getNotifications", config.url, config.params);

        return [200, mockNotificationsListing];
    });

    mockAxios.onPost("/api/notifications/seen").replyOnce(500, errorResponse);
    mockAxios.onPost("/api/notifications/seen").reply((config) => {
        console.log("Mark as Seen", config.url, config.data);

        return [200, {}];
    });

    mockAxios.onPost("/api/notifications/delete").replyOnce(500, errorResponse);
    mockAxios.onPost("/api/notifications/delete").reply((config) => {
        console.log("Delete Notifications", config.url, config.data);

        return [200, {}];
    });

    return (
        <NotificationsListing
            baseDebugId="notificationsListing"
            onMessageClicked={(message) =>
                console.log("onMessageClicked", message)
            }
        />
    );
};

export default { title: "Notifications" };
