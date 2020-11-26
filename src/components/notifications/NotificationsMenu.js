import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Link from "next/link";
import { formatDistance, fromUnixTime } from "date-fns";
import classnames from "classnames";

import {
    getNotifications,
    markAllSeen,
    NOTIFICATIONS_MARK_ALL_SEEN_KEY,
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
} from "serviceFacades/notifications";
import { useTranslation } from "../../i18n";
import ids from "./ids";
import NotificationStyles from "./styles";
import { getDisplayMessage } from "./utils";

import NavigationConstants from "common/NavigationConstants";

import ExternalLink from "components/utils/ExternalLink";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    makeStyles,
    Menu,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles(NotificationStyles);

// Listing constants for the notification menu.
const NOTIFICATION_MENU_SORT_FIELD = "timestamp";
const NOTIFICATION_MENU_SORT_ORDER = "desc";
const NOTIFICATION_MENU_LIMIT = 10;
const NOTIFICATION_MENU_OFFSET = 0;

/*
 * Takes in a notification object and returns the time
 * stamp of the notification in 'pretty format'
 */
function getTimeStamp(timestamp) {
    if (timestamp) {
        // slicing because time has extra zeroes in the unix string
        const d = fromUnixTime(timestamp.slice(0, -3));
        return formatDistance(d, new Date());
    }
}

const NotificationsListingButton = React.forwardRef((props, ref) => {
    const { isMobile, handleClose, href, onClick } = props;
    const { t } = useTranslation("common");
    const buttonId = build(
        ids.BASE_DEBUG_ID,
        ids.NOTIFICATIONS_MENU,
        ids.VIEW_ALL_NOTIFICATIONS
    );

    return isMobile ? (
        <IconButton
            className={useStyles().viewAll}
            id={buttonId}
            ref={ref}
            href={href}
            onClick={(event) => {
                onClick(event);
                handleClose();
            }}
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
});

function NotificationsListingLink(props) {
    const href = `/${NavigationConstants.NOTIFICATIONS}`;

    return (
        <Link href={href} as={href} passHref>
            <NotificationsListingButton {...props} />
        </Link>
    );
}

function InteractiveAnalysisUrl(props) {
    const { t } = useTranslation(["common"]);
    return (
        <span>
            {". "}
            <ExternalLink href={props.notification.payload.access_url}>
                {t("interactiveAnalysisUrl")}
            </ExternalLink>
        </span>
    );
}

function NotificationsMenu(props) {
    const { setUnSeenCount, notificationMssg, setAnchorEl, anchorEl } = props;
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState();
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const handleClose = () => {
        setAnchorEl();
    };

    const handleMarkAllAsSeenClick = () => {
        markAllSeenMutation();
        setAllNotificationsSeen();
        handleClose();
    };

    useEffect(() => {
        const found = notifications?.find(
            (msg) => msg.message.id === notificationMssg?.message.id
        );
        if ((found === null || found === undefined) && notificationMssg) {
            setNotifications([notificationMssg, ...notifications].slice(0, 10));
        }
    }, [notifications, notificationMssg]);

    const { isFetching } = useQuery({
        queryKey: [
            NOTIFICATIONS_MESSAGES_QUERY_KEY,
            {
                orderBy: NOTIFICATION_MENU_SORT_FIELD,
                order: NOTIFICATION_MENU_SORT_ORDER,
                limit: NOTIFICATION_MENU_LIMIT,
                offset: NOTIFICATION_MENU_OFFSET,
            },
        ],
        queryFn: getNotifications,
        config: {
            onSuccess: (results) => {
                setNotifications(results?.messages);
                if (results?.unseen_total > 0) {
                    setUnSeenCount(results?.unseen_total);
                }
                setError(null);
            },
            onError: setError,
            retry: 3,
        },
    });

    const [markAllSeenMutation] = useMutation({
        queryKey: NOTIFICATIONS_MARK_ALL_SEEN_KEY,
        queryFn: markAllSeen,
        config: {
            onSuccess: () => {
                setAllNotificationsSeen();
            },
            onError: (error) => {
                console.log("Error marking all notifications as Seen");
                // *** Will add this after understanding HOC better. ***
                // showErrorAnnouncer(
                //     t("errorMarkAsSeen", {
                //         count: notifications.length,
                //     }),
                //     error
                // );
            },
        },
    });

    const setAllNotificationsSeen = () => {
        setNotifications(
            notifications?.map((item) => {
                const tempItem = { ...item };
                tempItem.seen = true;
                return tempItem;
            })
        );
        setUnSeenCount(0);
    };

    return (
        <Menu
            anchorEl={anchorEl}
            id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <div>
                <Typography
                    className={classes.header}
                    component="span"
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.NOTIFICATIONS_HEADER
                    )}
                    variant="h6"
                >
                    {t("notifications")}
                </Typography>
                {isMobile && [
                    <NotificationsListingLink
                        key={ids.VIEW_ALL_NOTIFICATIONS}
                        handleClose={handleClose}
                        isMobile={isMobile}
                    />,
                    <IconButton
                        key={ids.MARK_ALL_READ}
                        className={classes.markSeen}
                        onClick={handleMarkAllAsSeenClick}
                        id={build(
                            ids.BASE_DEBUG_ID,
                            ids.NOTIFICATIONS_MENU,
                            ids.MARK_ALL_READ
                        )}
                    >
                        <DoneAllIcon size="small" />
                    </IconButton>,
                ]}
                <Divider />
            </div>
            {isFetching && (
                <Skeleton variant="rect" height={400} animation="wave" />
            )}
            {!isFetching && error !== null && (
                <ListItem>
                    <ErrorTypographyWithDialog
                        errorMessage={t("notificationError", error)}
                    />
                </ListItem>
            )}

            {!isFetching &&
                error === null &&
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
                        id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
                        key={n.message.id}
                        className={
                            !n.seen
                                ? classnames(
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
                                <Typography
                                    id={build(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        n?.id
                                    )}
                                    variant="subtitle2"
                                >
                                    {getDisplayMessage(n)}
                                    {n.payload.access_url && (
                                        <InteractiveAnalysisUrl
                                            notification={n}
                                        />
                                    )}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    id={build(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        ids.TIME_STAMP
                                    )}
                                    variant="caption"
                                >
                                    {t("timestamp", {
                                        timestamp: getTimeStamp(
                                            n.message?.timestamp
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
                    handleClose={handleClose}
                    isMobile={isMobile}
                />,
                <Button
                    key={ids.MARK_ALL_READ}
                    id={build(
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
        </Menu>
    );
}

export default NotificationsMenu;
