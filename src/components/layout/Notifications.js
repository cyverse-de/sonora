/**
 * @author sriram
 *
 * A component that displays recent notifications to the users. Updates the unseen count.
 *
 */

import React, { useCallback, useEffect, useState } from "react";

import { useTranslation } from "i18n";
import Link from "next/link";

import ids from "./ids";

import { useGotoOutputFolderLink } from "components/analyses/utils";
import analysisStatus from "components/models/analysisStatus";
import NotificationCategory from "components/models/NotificationCategory";

import { useNotifications } from "contexts/pushNotifications";

import NotificationsMenu from "../notifications/NotificationsMenu";
import {
    ANALYSIS_EMAIL_TEMPLATE,
    getDisplayMessage,
} from "../notifications/utils";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO, ERROR, SUCCESS } from "components/announcer/AnnouncerConstants";

import {
    Badge,
    Button,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const GotoOutputFolderButton = React.forwardRef((props, ref) => {
    const { onClick, href } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    return (
        <Button
            size="small"
            href={href}
            onClick={onClick}
            ref={ref}
            color="primary"
            title={t("goOutputFolder")}
            variant="outlined"
        >
            <Typography
                variant="button"
                style={{ color: theme.palette.primary.contrastText }}
            >
                {t("goOutputFolder")}
            </Typography>
        </Button>
    );
});

function AnalysisCustomAction(props) {
    const { outputFolderPath } = props;
    const [outputFolderHref, outputFolderAs] =
        useGotoOutputFolderLink(outputFolderPath);
    return (
        <Link
            href={outputFolderHref}
            as={outputFolderAs}
            passHref
            legacyBehavior
        >
            <GotoOutputFolderButton />
        </Link>
    );
}

function Notifications(props) {
    const { runningViceJobs, isFetchingRunningVice } = props;
    const { t } = useTranslation("common");
    const { currentNotification } = useNotifications();
    const theme = useTheme();
    const [unSeenCount, setUnSeenCount] = useState(0);
    const [notificationMssg, setNotificationMssg] = useState(null);

    const displayAnalysisNotification = useCallback((notification, status) => {
        const text = notification?.message?.text;
        const outputFolderPath = notification?.payload?.analysisresultsfolder;

        const completed = status === analysisStatus.COMPLETED;
        const failed = status === analysisStatus.FAILED;

        const variant = completed ? SUCCESS : failed ? ERROR : INFO;

        const CustomAction =
            (completed || failed) && outputFolderPath
                ? () => (
                      <AnalysisCustomAction
                          outputFolderPath={outputFolderPath}
                      />
                  )
                : null;

        announce({
            text,
            variant,
            CustomAction,
        });
    }, []);

    const displayNotification = useCallback(
        (notification, category) => {
            let analysisStatus =
                category.toLowerCase() ===
                    NotificationCategory.ANALYSIS.toLowerCase() ||
                notification["email_template"] === ANALYSIS_EMAIL_TEMPLATE
                    ? notification.payload.status
                    : "";

            if (analysisStatus) {
                displayAnalysisNotification(notification, analysisStatus);
            } else {
                announce({
                    text: getDisplayMessage(notification),
                });
            }
        },
        [displayAnalysisNotification]
    );

    const handleMessage = useCallback(
        (notifiMessage) => {
            if (notifiMessage?.total) {
                setUnSeenCount(notifiMessage.total);
            }
            const message = notifiMessage?.message;
            if (message) {
                const category = message.type;
                displayNotification(message, category);
                setNotificationMssg(message);
            }
        },
        [displayNotification]
    );

    useEffect(() => {
        handleMessage(currentNotification);
    }, [currentNotification, handleMessage]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Tooltip
                title={t("newNotificationAriaLabel")}
                placement="bottom"
                arrow
            >
                <IconButton
                    id={buildID(ids.APP_BAR_BASE, ids.NOTIFICATION_BTN)}
                    aria-label={t("newNotificationAriaLabel")}
                    style={{ color: theme.palette.primary.contrastText }}
                    onClick={handleClick}
                    size="large"
                >
                    <Badge badgeContent={unSeenCount} color="error">
                        <NotificationsIcon className={"notifications-intro"} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <>
                <NotificationsMenu
                    unSeenCount={unSeenCount}
                    setUnSeenCount={setUnSeenCount}
                    notificationMssg={notificationMssg}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    runningViceJobs={runningViceJobs}
                    isFetchingRunningVice={isFetchingRunningVice}
                />
            </>
        </>
    );
}

export default Notifications;
