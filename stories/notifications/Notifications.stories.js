/**
 * @author Flynn
 *
 */

import React from "react";
import NotificationsMenu from "../../src/components/notifications/NotificationsMenu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import notificationsData from "./notificationsData";
import { mockAxios } from "../axiosMock";

export default {
    title: "Notifications",
};

export const NotificationsPreviewTest = () => {
    mockAxios
        .onGet("/api/notifications/last-ten-messages")
        .reply(200, notificationsData);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
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
            />
        </>
    );
};
