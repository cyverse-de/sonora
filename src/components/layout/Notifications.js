/**
 * @author sriram
 *
 * A component that displays recent notifications to the users. Updates the unseen count.
 *
 */

import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { withTranslation } from "../../i18n";
import constants from "../../constants";
import analysisStatus from "../models/analysisStatus";
import NavigationConstants from "../../common/NavigationConstants";
import ids from "./ids";
import { useNotifications } from "../../contexts/pushNotifications";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";

import {
    Badge,
    Button,
    IconButton,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";

function Notifications(props) {
    const { t } = props;
    const [currentNotification] = useNotifications();
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
                        {t("viewOutput")}
                    </Typography>
                </Button>
            );
        },
        [goToOutputFolder, t, theme.palette.primary.contrastText]
    );

    const displayAnalysisNotification = useCallback(
        (notification, status) => {
            const text = notification?.message?.text;
            const outputFolderPath =
                notification?.payload?.analysisresultsfolder;

            const completed = status === analysisStatus.COMPLETED;
            const failed = status === analysisStatus.FAILED;

            const variant = completed
                ? AnnouncerConstants.SUCCESS
                : failed
                ? AnnouncerConstants.ERROR
                : AnnouncerConstants.INFO;

            const CustomAction =
                (completed || failed) && outputFolderPath
                    ? () => analysisCustomAction(outputFolderPath)
                    : null;

            announce({
                text,
                variant,
                CustomAction,
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
        (notifiMessage) => {
            let push_msg = null;
            try {
                push_msg = JSON.parse(notifiMessage);
            } catch (e) {
                return;
            }
            if (push_msg?.total) {
                setUnSeenCount(push_msg.total);
            }
            const message = push_msg?.message;
            if (message) {
                const category = message.type;
                displayNotification(message, category);
            }
        },
        [displayNotification]
    );

    useEffect(() => {
        handleMessage(currentNotification);
    }, [currentNotification, handleMessage]);

    return (
        <Tooltip title={t("newNotificationAriaLabel")} placement="bottom" arrow>
            <IconButton
                id={build(ids.APP_BAR_BASE, ids.NOTIFICATION_BTN)}
                aria-label={t("newNotificationAriaLabel")}
                style={{ color: theme.palette.primary.contrastText }}
            >
                <Badge badgeContent={unSeenCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
        </Tooltip>
    );
}

export default withTranslation("common")(Notifications);
