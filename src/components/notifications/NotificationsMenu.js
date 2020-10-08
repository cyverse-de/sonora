import React, {useEffect, useState} from "react";
import {formatDistance, fromUnixTime} from "date-fns";
import {
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import {NOTIFICATIONS_KEY, getNotifications} from "./../../serviceFacades/notifications";
import {useQuery} from "react-query";
import {Skeleton} from '@material-ui/lab';
import NotificationStyles from "./NotificationStyles";
import Divider from "@material-ui/core/Divider";
import ids from "./notificationsIDs"
import Alert from "@material-ui/lab/Alert";
import {build} from "@cyverse-de/ui-lib";

const useStyles = makeStyles(NotificationStyles);
const arrayRows = [...Array(10)];

function getDisplayMessage(notification) {
    if (notification) {
        return notification.type === "data"
            ? notification.subject
            : notification.message.text;
    }
}

function getTimeStamp(time) {
    if (time) {
        const d = fromUnixTime(time.slice(0, -3));
        return formatDistance(d, new Date());
    }
}


function NotificationLoading() {
    return (
        <>
            {arrayRows.map(() => (
                <>
                    <Skeleton
                        variant="rect"
                        width={400}
                        height={40}
                    />
                </>
            ))}
        </>
    )
}

function NotificationsMenu(props) {
    const {unSeenCount, notificationMssg, onClick, onClose, keepMounted, anchorEl, setAnchorEl} = props;
    const [notifications, setNotifications] = useState([]);
    const classes = useStyles();

    const baseDebugId = 'notifications';

    const {isFetching} = useQuery({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: getNotifications,
        config: {
            onSuccess: (results) => setNotifications(results?.messages),
        },
    });

    const handleClose = () => {
        props.setAnchorEl(null);
    };

    useEffect(() => {
        setNotifications([notificationMssg, ...notifications]);
    }, [notificationMssg]);


    return (
        <>
            <Menu
                anchorEl={props.anchorEl}
                id={build(baseDebugId, ids.NOTIFICATIONS_MENU)}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={handleClose}

            >

                <Typography
                    className={classes.header}
                    id={build(baseDebugId, ids.NOTIFICATIONS_MENU, ids.NOTIFICATIONS_HEADER)}
                    variant="h6">
                    Notifications

                </Typography>
                <Divider/>

                {isFetching && (
                    <NotificationLoading/>
                )}
                {!isFetching && (
                    <>
                        {notifications.length > 0 && notifications.reverse().map((n) => (
                            <>
                                <MenuItem onClick={handleClose}
                                          id={build(baseDebugId, 'NotificationsMenu')}>
                                    <ListItemText>
                                        <Typography
                                            id={build(baseDebugId, ids.NOTIFICATIONS_MENU, n?.id)}
                                            className={classes.notificationText}
                                            variant="subtitle2">
                                            {getDisplayMessage(n)}
                                        </Typography>
                                    </ListItemText>

                                    <Typography
                                        className={classes.timeStamp}
                                        id={build(baseDebugId, ids.NOTIFICATIONS_MENU, ids.TIME_STAMP)}
                                        variant="caption">
                                        {getTimeStamp(n?.timestamp)}
                                    </Typography>
                                </MenuItem>
                            </>

                        ))}
                    </>
                )
                }

                <div>
                    <Divider light/>
                    <Typography className={classes.footer}
                                id={build(baseDebugId, ids.NOTIFICATION_TEXT, ids.NOTIFICATION_FOOTER)}
                                variant="subtitle1"
                                unSeenCount={unSeenCount}
                                onClick={props.handleClose}
                    >
                        VIEW ALL NOTIFICATIONS AND ACTIVITIES
                    </Typography>
                </div>
            </Menu>

        </>

    );
}

export default NotificationsMenu;
