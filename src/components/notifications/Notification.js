import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import React from 'react';
import { formatDistance, compareAsc } from 'date-fns';
import {makeStyles, withStyles} from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import TableCell from "@material-ui/core/TableCell";
import NotificationStyles from "./NotificationStyles";
import Grid from "@material-ui/core/Grid";


function getDisplayMessage(notification) {
    return notification.type === "data"
        ? notification.subject
        : notification.message.text;
}

function Notification(props) {
    const { notification, onClick, classes } = props;
    let className = classes.notification;
    if (!notification.seen) {
        // change css
    }

    return (
        <>
            <div
                id={notification.message.id}
                className={className}
                // onClick={onClick}
            >
                <MenuItem >
                    <ListItemText
                        className={classes.notificationText}
                        primary={getDisplayMessage(notification)}>
                    </ListItemText>
                    <Typography className={classes.timeStamp}>
                        {formatDistance(new Date("2020-08-20T09:25:31.708Z"), new Date())}
                    </Typography>

                </MenuItem>
            </div>
            <Divider light />
        </>
    );
}

export default withStyles(NotificationStyles)(Notification);
