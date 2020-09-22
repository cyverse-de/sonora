import React, { useState } from "react";
import { formatDistance, fromUnixTime } from "date-fns";
import {
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { NOTIFICATIONS_KEY, getNotifications} from "./../../serviceFacades/notifications";
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useQuery } from "react-query";
import { Skeleton } from '@material-ui/lab';
import NotificationStyles from "./NotificationStyles";
import Divider from "@material-ui/core/Divider";
import ids from "./notificationsIDs"
import build from "@cyverse-de/ui-lib/src/util/DebugIDUtil";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(NotificationStyles);

function ErrorComponent(props) {
    return (
        <Alert onClose={() => {}}>
            There was an error fetching the latest notifications. Please try again!
        </Alert>
    );
}

function getDisplayMessage(notification) {
    return notification.type === "data"
        ? notification.subject
        : notification.message.text;
}

function getTimeStamp(time) {
    const d = fromUnixTime(time);
    const newDate = new Date();
    return formatDistance(d, new Date());
}

function NotificationsMenu(props) {
    const { unSeenCount, baseDebugId } = props;
    const [ notifications, setNotifications ] = useState();
    const [anchorEl, setAnchorEl] = useState(true);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { isFetching } = useQuery({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: getNotifications,
        config: {
            onSuccess: (results) => setNotifications(results),
            onError: (error) => ErrorComponent(),
        },
    });

    const messages =
        notifications &&
        notifications.messages &&
        notifications.messages.length > 0
            ? notifications.messages
            : [];

    return (
        <div>

            <NotificationsIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Notifications
            </NotificationsIcon>


        <Menu
            anchorEl={anchorEl}
            id={build(baseDebugId, ids.NOTIFICATIONS_MENU)}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >

            <Typography
                className={classes.header}
                id={build(baseDebugId, ids.NOTIFICATIONS_MENU, ids.NOTIFICATIONS_HEADER)}
                variant="h6">
                Notifications
            </Typography>
            <Divider />

            {messages.map((n) => (
                <>
                <MenuItem
                id={build(baseDebugId, NotificationsMenu)}>
                    <ListItemText>
                         <Typography
                            id={build(baseDebugId,ids.NOTIFICATIONS_MENU,n.message.id)}
                            className={classes.notificationText}
                            variant="subtitle2">
                            {getDisplayMessage(n)}
                         </Typography>
                    </ListItemText>

                    <Typography
                        className={classes.timeStamp}
                        id={build(baseDebugId,ids.NOTIFICATIONS_MENU,ids.TIME_STAMP)}
                        variant="caption">
                        {getTimeStamp(n.message.timestamp)}
                    </Typography>
                </MenuItem>
                <Divider light />
                </>

            ))}
            <div>
                <Divider light />
                <Typography className={classes.footer}
                    id={build(baseDebugId, ids.NOTIFICATION_TEXT, ids.NOTIFICATION_FOOTER)}
                    variant="subtitle1"
                    unSeenCount={unSeenCount}
                    onClick={handleClose}
                >
                    VIEW ALL NOTIFICATIONS AND ACTIVITIES
                </Typography>
            </div>
        </Menu>

        </div>
    );
}

export default NotificationsMenu;
