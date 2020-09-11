import React, { Component } from "react";
import { formatDistance, compareAsc } from 'date-fns';
import { makeStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItemText from "@material-ui/core/ListItemText";
import TableCell from "@material-ui/core/TableCell";
import NotificationStyles from "./NotificationStyles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import build from "@cyverse-de/ui-lib/src/util/DebugIDUtil";
import Alert from "@material-ui/lab/Alert";
import {LoadingMask} from "../../../stories/apps/launch/LoadingMask.stories";
import * as classnames from "classnames";
import Skeleton from "@material-ui/lab/Skeleton";
const useStyles = makeStyles(NotificationStyles);
const setDate = '2020-08-09 02:07:10';              // example date

/*
   This function takes a string in format `yyyy-mm-dd  hh:mm:ss` and returns a date object with that
   time
 */

function getDisplayMessage(notification) {
    return notification.type === "data"
        ? notification.subject
        : notification.message.text;
}

function getDisplayTime(notification) {

}

function ErrorComponent(props) {
    return (
        <Alert onClose={() => {}}>This is a success alert — check it out!</Alert>
    );
}

function Notification(props) {
    const { notification, onClick } = this.props;
    const classes = props;
    let className = classes.notification;
    if (!notification.seen) {
        // change css
    }
    return (
        <>
            <div
                // id={notification.message.id}
                className={className}
                // onClick={onClick}
            >
                <MenuItem >
                    <ListItemText>
                        primary={"DSFGDHF"}
                        {/*className={classes.notificationText}*/}
                        {/*primary={getDisplayMessage(notification)}>*/}
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

function NotificationsMenu(props) {

    const {anchorEl, setAnchorEl} = this.state;
    const classes = useStyles();
    const
        notifications = props.notifications,
        unSeenCount = props.unSeenCount,
        notificationLoading = props.notificationLoading,
        error = props.error;

    const handleClick = event => {
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
        <div>
            {error && messages.length > 0 ? (
                messages
                    .map((n) => {
                        return (
                            <Notification
                                key={n.message.id}
                                notification={n}
                                onClick={this.onMenuItemSelect}
                                classes={classes}
                            />
                        );
                    })
                    .reverse()
            ) : (
                <div>
                    <Skeleton variant="rect" width={210} height={118} />
                </div>
            )}
            <div>
               <Divider light/>
            <Typography
                // onClick={this.props.onViewAllNotificationsClicked}
                variant="subtitle1"
                unSeenCount={unSeenCount}
                onClick={this.handleClose}
                classes={classes}>
                VIEW ALL NOTIFICATIONS AND ACTIVITIES
            </Typography>
            </div>
        </div>
    );
}

export default withStyles(NotificationsMenu);
