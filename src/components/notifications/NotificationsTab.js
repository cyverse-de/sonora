import React from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Skeleton } from "@mui/material";
import Link from "next/link";

import NavigationConstants from "common/NavigationConstants";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { useTranslation } from "i18n";
import ids from "./ids";
import Message from "./Message";
import styles from "./styles";
import { getFormattedDistance } from "components/utils/DateFormatter";

const useStyles = makeStyles()(styles);

const NotificationsListingButton = React.forwardRef(
    function NotificationsListingButton(props, ref) {
        const { isMobile, handleClose, href, onClick } = props;
        const { t } = useTranslation("common");
        const buttonId = buildID(
            ids.BASE_DEBUG_ID,
            ids.NOTIFICATIONS_MENU,
            ids.VIEW_ALL_NOTIFICATIONS
        );

        const { classes } = useStyles();

        return isMobile ? (
            <IconButton
                className={classes.viewAll}
                id={buttonId}
                ref={ref}
                href={href}
                onClick={(event) => {
                    onClick(event);
                    handleClose();
                }}
                size="large"
            >
                <OpenInNewIcon size="small" />
            </IconButton>
        ) : (
            <Button
                id={buttonId}
                color="primary"
                startIcon={<OpenInNewIcon size="small" />}
                ref={ref}
                href={href}
                onClick={(event) => {
                    onClick(event);
                    handleClose();
                }}
            >
                {t("viewAllNotifications")}
            </Button>
        );
    }
);

function NotificationsListingLink(props) {
    const href = `/${NavigationConstants.NOTIFICATIONS}`;

    return (
        <Link href={href} as={href} passHref legacyBehavior>
            <NotificationsListingButton {...props} />
        </Link>
    );
}

function NotificationsTab(props) {
    const {
        isFetching,
        notifications,
        handleClose,
        handleMarkAllAsSeenClick,
        errorObject,
    } = props;

    const { classes, cx } = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useTranslation("common");

    return (
        <>
            {isMobile && [
                <NotificationsListingLink
                    key={ids.VIEW_ALL_NOTIFICATIONS}
                    id={buildID(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
                    handleClose={handleClose}
                    isMobile={isMobile}
                />,
                <IconButton
                    key={ids.MARK_ALL_READ}
                    className={classes.markSeen}
                    onClick={handleMarkAllAsSeenClick}
                    id={buildID(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.MARK_ALL_READ
                    )}
                    size="large"
                >
                    <DoneAllIcon size="small" />
                </IconButton>,
            ]}
            {isFetching && (
                <Skeleton variant="rectangular" height={400} animation="wave" />
            )}
            {!isFetching && errorObject !== null && (
                <ListItem>
                    <ErrorTypographyWithDialog
                        errorMessage={t("notificationError", errorObject)}
                    />
                </ListItem>
            )}

            {!isFetching &&
                errorObject === null &&
                (notifications === null || notifications.length === 0) && (
                    <ListItem>
                        <Typography variant="body2">
                            {t("noNotifications")}
                        </Typography>
                    </ListItem>
                )}

            {!isFetching &&
                notifications.length > 0 &&
                notifications.map((n, index) => (
                    <ListItem
                        onClick={handleClose}
                        id={buildID(
                            ids.BASE_DEBUG_ID,
                            ids.NOTIFICATIONS_MENU,
                            index
                        )}
                        key={n.message.id}
                        className={
                            !n.seen
                                ? cx(
                                      classes.notification,
                                      classes.unSeenNotificationBackground
                                  )
                                : classes.notification
                        }
                        dense={true}
                        divider={true}
                    >
                        <ListItemText
                            primary={
                                <Message
                                    baseId={buildID(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        n?.message.id
                                    )}
                                    notification={n}
                                />
                            }
                            secondary={
                                <Typography
                                    id={buildID(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        ids.TIME_STAMP
                                    )}
                                    variant="caption"
                                >
                                    {t("timestamp", {
                                        timestamp: getFormattedDistance(
                                            n.message?.timestamp.slice(0, -3)
                                        ),
                                    })}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}

            {!isMobile && [
                <Divider light key="divider" />,
                <NotificationsListingLink
                    key={ids.VIEW_ALL_NOTIFICATIONS}
                    id={buildID(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
                    handleClose={handleClose}
                    isMobile={isMobile}
                />,
                <Button
                    key={ids.MARK_ALL_READ}
                    id={buildID(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.MARK_ALL_READ
                    )}
                    color="primary"
                    onClick={handleMarkAllAsSeenClick}
                    startIcon={<DoneAllIcon size="small" />}
                >
                    {t("markAsRead")}
                </Button>,
            ]}
        </>
    );
}

export default NotificationsTab;
