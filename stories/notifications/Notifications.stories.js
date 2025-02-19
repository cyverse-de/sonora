/**
 * @author Flynn
 *
 */

import React from "react";
import { NotificationsProvider } from "contexts/pushNotifications";
import NotificationsMenu from "components/notifications/NotificationsMenu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import notificationsData from "./notificationsData";
import { mockAxios } from "../axiosMock";
import { runningViceJobs } from "../analyses/AnalysesMocks";

export default {
    title: "Notifications / Top 10",
};

export const NotificationsPreviewTest = () => {
    mockAxios
        .onGet("/api/notifications/last-ten-messages")
        .reply(200, notificationsData);
    mockAxios.onGet("/api/analyses").reply(200, runningViceJobs);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <NotificationsProvider wsEnabled={false}>
            <NotificationsIcon
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            />

            <NotificationsMenu
                baseDebugId="notificationWindow"
                anchorEl={anchorEl}
                onClose={handleClose}
                onClick={handleClick}
                setAnchorEl={setAnchorEl}
                setUnSeenCount={(count) => console.log(count)}
            />
        </NotificationsProvider>
    );
};
