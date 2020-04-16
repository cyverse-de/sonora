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
import NavigationConstants from "../../common/NavigationConstants";
import { useUserProfile } from "../../contexts/userProfile";
import ids from "./ids";

import { Badge, Button, IconButton, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import {
    announce,
    AnnouncerConstants,
    build,
    formatMessage,
} from "@cyverse-de/ui-lib";
import NotificationsIcon from "@material-ui/icons/Notifications";

function Notifications(props) {
    const { intl, classes } = props;
    const [userProfile] = useUserProfile();
    const theme = useTheme();
    const router = useRouter();
    const [unSeenCount, setUnSeenCount] = useState(0);
    const gotToOutputFolder = useCallback(
        (outputFolder) => {
            router.push(
                `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${constants.PATH_SEPARATOR}ds${outputFolder}`
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
                        console.log("output folder path=>" + outputFolderPath);
                        gotToOutputFolder(outputFolderPath); //gotcha - I cannot do router.push from here
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
        [gotToOutputFolder, intl, theme.palette.primary.contrastText]
    );

    const displayAnalysisNotification = useCallback(
        (notification, analysisStatus) => {
            let variant = AnnouncerConstants.INFO;
            if (analysisStatus === constants.analysisStatus.COMPLETED) {
                variant = AnnouncerConstants.SUCCESS;
            } else if (analysisStatus === constants.analysisStatus.FAILED) {
                variant = AnnouncerConstants.ERROR;
            }
            announce({
                text: notification.message.text,
                variant,
                customAction:
                    analysisStatus === constants.analysisStatus.COMPLETED ||
                    analysisStatus === constants.analysisStatus.FAILED
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
                constants.notificationCategory.ANALYSIS.toLowerCase()
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
                onreconnect: (e) => console.log("Reconnecting...", e),
                onmaximum: (e) => console.log("Stop Attempting!", e),
                onclose: (e) => console.log("Closed!", e),
                onerror: (e) => console.log("Error:", e),
            });
            return () => {
                ws.close();
            };
        }
    }, [userProfile, handleMessage]);

    return (
        <IconButton
            id={build(ids.APP_BAR_BASE, ids.NOTIFICATION_BTN)}
            className={classes.margin}
            aria-label={formatMessage(intl, "newNotificationAriaLabel")}
            color="primary"
            size="small"
        >
            <Badge badgeContent={unSeenCount} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>
    );
}

export default Notifications;
