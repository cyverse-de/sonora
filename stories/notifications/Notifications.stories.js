/**
 * @author Flynn
 *
 */

import React from "react";
import NotificationsMenu from "../../src/components/notifications/NotificationsMenu";
import notificationsData from "./notificationsData";
import { mockAxios} from "../axiosMock";

export default {
    title: "Notifications",
};

export const NotificationsPreviewTest = () => {
    mockAxios.onGet("/api/notifications/last-ten-messages").reply(200, notificationsData);

     return (
        <NotificationsMenu
            baseDebugId="notificationWindow"
        />
     );
};