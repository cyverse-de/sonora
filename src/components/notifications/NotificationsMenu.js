import React, { useEffect, useState } from "react";
import { formatDistance, fromUnixTime } from "date-fns";
import {
    NOTIFICATIONS_LAST_TEN_KEY,
    getLastTenNotifications,
} from "./../../serviceFacades/notifications";
import { useQuery } from "react-query";
import { Skeleton } from "@material-ui/lab";
import NotificationStyles from "./styles";
import Divider from "@material-ui/core/Divider";
import ids from "./ids";
import { build } from "@cyverse-de/ui-lib";
import Button from "@material-ui/core/Button";
import {
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { useTranslation } from "../../i18n";

const useStyles = makeStyles(NotificationStyles);

function getDisplayMessage(notification) {
    if (notification) {
        return notification.type === "data"
            ? notification.subject
            : notification.message.text;
    }
}

function getTimeStamp(time) {
    if (time) {
        // slicing because time has extra zeroes in the unix string
        const d = fromUnixTime(time.slice(0, -3));
        return formatDistance(d, new Date());
    }
}

function NotificationsMenu(props) {
    const { setUnSeenCount, notificationMssg, setAnchorEl, anchorEl } = props;
    const [notifications, setNotifications] = useState([]);
    const classes = useStyles();
    const { t } = useTranslation(["common"]);

    const handleClose = () => {
        setAnchorEl();
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
        queryKey: NOTIFICATIONS_LAST_TEN_KEY,
        queryFn: getLastTenNotifications,
        config: {
            onSuccess: (results) => {
                setNotifications(results?.messages.reverse());
                setUnSeenCount(results?.unseen_total);
            },
        },
    });

    return (
        <Menu
            anchorEl={anchorEl}
            id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <Typography
                className={classes.header}
                id={build(
                    ids.BASE_DEBUG_ID,
                    ids.NOTIFICATIONS_MENU,
                    ids.NOTIFICATIONS_HEADER
                )}
                variant="h6"
            >
                {t("notifications")}
            </Typography>
            <Divider />

            {isFetching && <Skeleton variant="rect" width={350} height={400} />}
            {!isFetching &&
                notifications.length > 0 &&
                notifications.map((n, index) => (
                    <MenuItem
                        onClick={handleClose}
                        id={build(ids.BASE_DEBUG_ID, "ids.NOTIFICATION_MENU")}
                        key={n.message.id}
                    >
                        <ListItemText>
                            <Typography
                                id={build(
                                    ids.BASE_DEBUG_ID,
                                    ids.NOTIFICATIONS_MENU,
                                    n?.id
                                )}
                                variant="subtitle2"
                            >
                                {getDisplayMessage(n)}
                            </Typography>
                        </ListItemText>

                        <Typography
                            className={classes.timeStamp}
                            id={build(
                                ids.BASE_DEBUG_ID,
                                ids.NOTIFICATIONS_MENU,
                                ids.TIME_STAMP
                            )}
                            variant="caption"
                        >
                            {getTimeStamp(n.message?.timestamp)}
                        </Typography>
                    </MenuItem>
                ))}

            <Divider light />
            <>
                <Button
                    size="large"
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
                    color="primary"
                    onClick={handleClose}
                >
                    {t("viewAllNotifications")}
                </Button>
                <Button
                    size="large"
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.MARK_ALL_READ
                    )}
                    color="primary"
                    onClick={setUnSeenCount(0)}
                >
                    {t("markAsRead")}
                </Button>
            </>
        </Menu>
    );
}

export default NotificationsMenu;
