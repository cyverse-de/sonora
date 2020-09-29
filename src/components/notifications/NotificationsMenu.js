import React, {useEffect, useState} from "react";
import { formatDistance, fromUnixTime } from "date-fns";
import {
    ListItemText,
    makeStyles,
    Menu,
    MenuItem, TableCell,
    Typography, withStyles,
} from "@material-ui/core";
import { NOTIFICATIONS_KEY, getNotifications} from "./../../serviceFacades/notifications";
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useQuery } from "react-query";
import { Skeleton } from '@material-ui/lab';
import { getMessage, withI18N, build } from "@cyverse-de/ui-lib";
import messages from "./../../../stories/notifications/notificationsData"
import NotificationStyles from "./NotificationStyles";

import Divider from "@material-ui/core/Divider";
import ids from "./notificationsIDs"
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(NotificationStyles);
const arrayRows = [...Array(10)];


function ErrorComponent(props) {
    return (
        <Alert onClose={() => {}}>
            {getMessage('There was an error fetching the latest notifications. Please try again!')}
        </Alert>
    );
}

function getDisplayMessage(notification) {
    return notification.type === "data"
        ? notification.subject
        : notification.message.text;
}

function getTimeStamp(time) {
    const d = fromUnixTime(time.slice(0,-3));
    return formatDistance(d, new Date());
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
                     <Divider/>
                 </>
                    ))}
            </>
        )
}

function addNewNotification(notificationMssg) {
    return;
}

function NotificationsMenu(props) {
    const { unSeenCount, notificationMssg} = props;
    const [ notifications, setNotifications ] = useState();
    const [anchorEl, setAnchorEl] = useState(true);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const baseDebugId='notifications';

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

    useEffect(() => {
        addNewNotification(notificationMssg);
    }, [notificationMssg, addNewNotification]);

    const messages =
        notifications &&
        notifications.messages &&
        notifications.messages.length > 0
            ? notifications.messages
            : [];


    if (isFetching) {
        return (
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
                    {getMessage("Notifications")}
                </Typography>
                <Divider/>

                    <NotificationLoading/>

                <div>
                    <Divider light/>
                    <Typography className={classes.footer}
                                id={build(baseDebugId, ids.NOTIFICATION_TEXT, ids.NOTIFICATION_FOOTER)}
                                variant="subtitle1"
                                unSeenCount={unSeenCount}
                                onClick={handleClose}
                    >
                        {getMessage('VIEW ALL NOTIFICATIONS AND ACTIVITIES')}
                    </Typography>
                </div>
            </Menu>
        );
    }
    else {
        return (
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
                    {getMessage("Notifications")}
                </Typography>
                <Divider/>

                {messages.map((n) => (
                    <>
                    <MenuItem
                    id={build(baseDebugId, NotificationsMenu)}>
                    <ListItemText>
                    <Typography
                    id={build(baseDebugId, ids.NOTIFICATIONS_MENU, n.message.id)}
                    className={classes.notificationText}
                    variant="subtitle2">
                    {getDisplayMessage(n)}
                    </Typography>
                    </ListItemText>

                    <Typography
                    className={classes.timeStamp}
                    id={build(baseDebugId, ids.NOTIFICATIONS_MENU, ids.TIME_STAMP)}
                    variant="caption">
                    {getTimeStamp(n.message.timestamp)}
                    </Typography>
                    </MenuItem>
                    <Divider light/>
                    </>

                    ))}
                <div>
                    <Divider light/>
                    <Typography className={classes.footer}
                                id={build(baseDebugId, ids.NOTIFICATION_TEXT, ids.NOTIFICATION_FOOTER)}
                                variant="subtitle1"
                                unSeenCount={unSeenCount}
                                onClick={handleClose}
                    >
                        {getMessage('VIEW ALL NOTIFICATIONS AND ACTIVITIES')}
                    </Typography>
                </div>
            </Menu>
        );
    }
}

export default withI18N(withStyles(NotificationStyles)(NotificationsMenu), messages);
