import React from "react";

import { AdminTeamJoinRequestNotification } from "./NotificationMocks";
import AdminJoinTeamRequestDialog from "components/notifications/dialogs/AdminJoinTeamRequestDialog";
import { NotificationsProvider } from "contexts/pushNotifications";
import { mockAxios } from "../axiosMock";

export const AdminTeamJoinRequestDlg = () => {
    const teamName = "ipcdev:test_team";

    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .reply(200);
    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .reply(200);

    mockAxios
        .onPost(
            `/api/teams/${encodeURIComponent(
                teamName
            )}/join-request/batman/deny`
        )
        .reply(200);

    return (
        <NotificationsProvider wsEnabled={false}>
            <AdminJoinTeamRequestDialog
                open={true}
                onClose={() =>
                    console.log("Close Admin Join Team Request Dialog")
                }
                request={AdminTeamJoinRequestNotification.payload}
            />
        </NotificationsProvider>
    );
};

export default { title: "Notifications / Admin Team Join Request Dialog" };
