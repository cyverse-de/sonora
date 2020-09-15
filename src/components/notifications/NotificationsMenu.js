import React, { useState } from "react";
import { formatDistance } from "date-fns";
import {
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import NotificationStyles from "./NotificationStyles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(NotificationStyles);

/*
   This function takes a string in format `yyyy-mm-dd  hh:mm:ss` and returns a date object with that
   time
 */

function getDisplayMessage(notification) {
    return notification.type === "data"
        ? notification.subject
        : notification.message.text;
}

function NotificationsMenu(props) {
    const { notifications, unSeenCount, baseDebugId } = props;

    const [anchorEl, setAnchorEl] = useState(true);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const messages =
        notifications &&
        notifications.messages &&
        notifications.messages.length > 0
            ? notifications.messages
            : [];

    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {messages.map((n) => (
                <MenuItem>
                    <ListItemText
                        className={classes.notificationText}
                        primary={getDisplayMessage(n)}
                    />
                    <Typography className={classes.timeStamp}>
                        {formatDistance(
                            new Date("2020-08-20T09:25:31.708Z"),
                            new Date()
                        )}
                    </Typography>
                </MenuItem>
            ))}
            <div>
                <Divider light />
                <Typography
                    // onClick={this.props.onViewAllNotificationsClicked}
                    variant="subtitle1"
                    unSeenCount={unSeenCount}
                    onClick={handleClose}
                >
                    VIEW ALL NOTIFICATIONS AND ACTIVITIES
                </Typography>
            </div>
        </Menu>
    );
}

export default NotificationsMenu;
