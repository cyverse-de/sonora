import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Link from "next/link";
import { formatDistance, fromUnixTime } from "date-fns";
import classnames from "classnames";
import { useUserProfile } from "../../contexts/userProfile";
import {
    getNotifications,
    markAllSeen,
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
} from "../../serviceFacades/notifications";
import { useTranslation } from "../../i18n";
import ids from "./ids";
import NotificationStyles from "./styles";
import NavigationConstants from "common/NavigationConstants";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";

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
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Message from "./Message";
import ErrorTypography from "../utils/error/ErrorTypography";
import DEErrorDialog from "../utils/error/DEErrorDialog";

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

function NotificationsMenu(props) {
    const {
        setUnSeenCount,
        notificationMssg,
        setAnchorEl,
        anchorEl,
        showErrorAnnouncer,
    } = props;
    const [notifications, setNotifications] = useState([]);
    const [userProfile] = useUserProfile();
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const handleClose = () => {
        setAnchorEl();
    };

    const handleMarkAllAsSeenClick = () => {
        markAllSeenMutation();
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
                setErrorObject(null);
            },
            onError: (e) => {
                setErrorObject(e);
                const status = e?.response?.status;
                setErrorMessage(
                    status === 401
                        ? t("notificationSignInError")
                        : t("notificationError")
                );
            },
            retry: 3,
        },
    });

    const [markAllSeenMutation] = useMutation(markAllSeen, {
        onSuccess: () => {
            setAllNotificationsSeen();
        },
        onError: (errorObject) => {
            showErrorAnnouncer(t("errorMarkAsSeen"), errorObject);
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

                {!userProfile?.id && (
                    <ListItem>
                        <ErrorTypography
                            errorMessage={errorMessage}
                            onDetailsClick={() => setErrorDialogOpen(true)}
                        />
                        <DEErrorDialog
                            open={errorDialogOpen}
                            id={build(
                                ids.BASE_DEBUG_ID,
                                ids.SIGN_IN_ERR_DIALOGUE
                            )}
                            errorObject={errorObject}
                            handleClose={() => {
                                setErrorDialogOpen(false);
                            }}
                        />
                    </ListItem>
                )}

                {isMobile && [
                    <NotificationsListingLink
                        key={ids.VIEW_ALL_NOTIFICATIONS}
                        id={build(
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
            {!isFetching && errorObject !== null && userProfile?.id && (
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
                        id={build(
                            ids.BASE_DEBUG_ID,
                            ids.NOTIFICATIONS_MENU,
                            index
                        )}
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
                                <Message
                                    baseId={build(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        n?.message.id
                                    )}
                                    notification={n}
                                />
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
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
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

export default withErrorAnnouncer(NotificationsMenu);
