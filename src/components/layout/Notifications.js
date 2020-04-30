/**
 * @author sriram
 *
 * A component that displays recent notifications to the users. Updates the unseen count.
 *
 */

import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";
import Sockette from "sockette";

import constants from "../../constants";
import analysisStatus from "../models/analysisStatus";
import NavigationConstants from "../../common/NavigationConstants";
import { useUserProfile } from "../../contexts/userProfile";
import ids from "./ids";

import {
    announce,
    AnnouncerConstants,
    build,
    formatMessage,
} from "@cyverse-de/ui-lib";

import { Badge, Button, IconButton, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";

function Notifications(props) {
    const { intl } = props;
    const [userProfile] = useUserProfile();
    const theme = useTheme();
    const router = useRouter();
    const [unSeenCount, setUnSeenCount] = useState(0);
    const goToOutputFolder = useCallback(
        (outputFolder) => {
            router.push(
                `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${constants.PATH_SEPARATOR}${constants.DATA_STORE_STORAGE_ID}${outputFolder}`
            );
        },
        [router]
    );

    const analysisCustomAction = useCallback(
        (outputFolderPath) => {
            return (
                <Button
                    key={outputFolderPath}
                    variant="outlined"
                    onClick={() => {
                        goToOutputFolder(outputFolderPath); //gotcha - I cannot do router.push from here
                    }}
                >
                    <Typography
                        variant="button"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        {formatMessage(intl, "viewOutput")}
                    </Typography>
                </Button>
            );
        },
        [goToOutputFolder, intl, theme.palette.primary.contrastText]
    );

    const displayAnalysisNotification = useCallback(
        (notification, status) => {
            let variant = AnnouncerConstants.INFO;
            if (status === analysisStatus.COMPLETED) {
                variant = AnnouncerConstants.SUCCESS;
            } else if (status === analysisStatus.FAILED) {
                variant = AnnouncerConstants.ERROR;
            }
            announce({
                text: notification.message.text,
                variant,
                CustomAction:
                    status === analysisStatus.COMPLETED ||
                    status === analysisStatus.FAILED
                        ? () =>
                              analysisCustomAction(
                                  notification.payload.analysisresultsfolder
                              )
                        : null,
            });
        },
        [analysisCustomAction]
    );

    const displayNotification = useCallback(
        (notification, category) => {
            let analysisStatus =
                category.toLowerCase() ===
                constants.NOTIFICATION_CATEGORY.ANALYSIS.toLowerCase()
                    ? notification.payload.status
                    : "";

            if (analysisStatus) {
                displayAnalysisNotification(notification, analysisStatus);
            } else {
                announce({
                    text: notification.message.text,
                });
            }
        },
        [displayAnalysisNotification]
    );

    const handleMessage = useCallback(
        (event) => {
            console.log(event.data);
            let push_msg = null;
            try {
                push_msg = JSON.parse(event.data);
            } catch (e) {
                return;
            }
            if (push_msg.total) {
                setUnSeenCount(push_msg.total);
            }

            const message = push_msg.message;
            if (message) {
                const category = message.type;
                displayNotification(message, category);
            }
        },
        [displayNotification]
    );
    React.useEffect(() => {
        if (userProfile?.id) {
            let location = window.location;
            let protocol =
                location.protocol.toLowerCase() === "https:"
                    ? constants.WSS_PROTOCOL
                    : constants.WS_PROTOCOL;
            let host = location.hostname;
            let port = location.port;
            const notificationUrl =
                protocol +
                host +
                (port ? ":" + port : "") +
                NavigationConstants.NOTIFICATION_WS;
            console.log("Connecting websocket to " + notificationUrl);

            const ws = new Sockette(notificationUrl, {
                maxAttempts: 10,
                onopen: (e) => {
                    console.log("Websocket connected!");
                    ws.send("Connected by " + userProfile.id);
                },
                onmessage: (e) => handleMessage(e),
                onreconnect: (e) => console.log("Websocket Reconnecting...", e),
                onmaximum: (e) => console.log("Websocket Stop Attempting!", e),
                onclose: (e) => console.log("Websocket Closed!", e),
                onerror: (e) => console.log("Websocket Error:", e),
            });
            return () => {
                ws.close();
            };
        }
    }, [userProfile, handleMessage]);

    return (
        <IconButton
            id={build(ids.APP_BAR_BASE, ids.NOTIFICATION_BTN)}
            aria-label={formatMessage(intl, "newNotificationAriaLabel")}
            color="primary"
        >
            <Badge badgeContent={unSeenCount} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>
    );
}

export default Notifications;
