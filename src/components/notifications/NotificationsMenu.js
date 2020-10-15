import React, { useEffect, useState } from "react";
import { formatDistance, fromUnixTime } from "date-fns";
import {
    NOTIFICATIONS_KEY,
    getNotifications,
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
    const { notificationMssg, setAnchorEl, anchorEl } = props;
    const [notifications, setNotifications] = useState([]);
    const classes = useStyles();
    const { t } = useTranslation(["common"]);

    const handleClose = () => {
        setAnchorEl();
    };

    useEffect(() => {
        if (notificationMssg != null) {
            setNotifications([notificationMssg, ...notifications].reverse());
        }
    }, [notifications, notificationMssg]);

    const { isFetching } = useQuery({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: getNotifications,
        config: {
            onSuccess: (results) => setNotifications(results?.messages),
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
                notifications.slice(0, 10).map((n, index) => (
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
            <Button
                className={classes.footer}
                size="large"
                id={build(
                    ids.BASE_DEBUG_ID,
                    ids.NOTIFICATIONS_MENU,
                    ids.VIEW_ALL_NOTIFICATIONS
                )}
                fullWidth={true}
                color="primary"
                onClick={handleClose}
            >
                {t("viewAllNotifications")}
            </Button>
        </Menu>
    );
}

export default NotificationsMenu;
