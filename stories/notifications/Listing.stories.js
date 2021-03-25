import React from "react";

import { mockAxios, errorResponseJSON } from "../axiosMock";

import { mockNotificationsListing } from "./NotificationMocks";

import NotificationsListing from "components/notifications/listing";

export const Listing = () => {
    const teamName = "ipcdev:test_team";

    mockAxios.onGet(/\/api\/notifications\/messages*/).reply((config) => {
        console.log("getNotifications", config.url, config.params);

        return [200, mockNotificationsListing];
    });

    mockAxios
        .onPost("/api/notifications/seen")
        .replyOnce(500, errorResponseJSON);
    mockAxios.onPost("/api/notifications/seen").reply((config) => {
        console.log("Mark as Seen", config.url, config.data);

        return [200, {}];
    });

    mockAxios
        .onPost("/api/notifications/delete")
        .replyOnce(500, errorResponseJSON);
    mockAxios.onPost("/api/notifications/delete").reply((config) => {
        console.log("Delete Notifications", config.url, config.data);

        return [200, {}];
    });

    mockAxios
        .onPost(
            `/api/teams/${encodeURIComponent(
                teamName
            )}/join-request/batman/deny`
        )
        .replyOnce(500, errorResponseJSON)
        .onPost(
            `/api/teams/${encodeURIComponent(
                teamName
            )}/join-request/batman/deny`
        )
        .reply(200);

    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .reply(200);
    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .replyOnce(500, errorResponseJSON)
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .reply(200);

    return <NotificationsListing baseDebugId="notificationsListing" />;
};

export default { title: "Notifications / Listing" };
