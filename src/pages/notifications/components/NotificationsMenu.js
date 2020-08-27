import React from 'react';
import { formatDistance, compareAsc } from 'date-fns';
import { makeStyles } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
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
import {LoadingMask} from "../../../../stories/apps/launch/LoadingMask.stories";
import * as classnames from "classnames";
const useStyles = makeStyles(NotificationStyles);
const setDate = '2020-08-09 02:07:10';              // example date

/*
   This function takes a string in format `yyyy-mm-dd  hh:mm:ss` and returns a date object with that
   time
 */
function dateStringToObj(dateStr) {

    // 2020-08-20T09:25:31.708Z             // CyVerse date format

    const randDate = '2020-03-01 02:07:10';              // example date
    dateStr = randDate;
    const dateObj = new Date();
    if (typeof dateStr === 'string') {
        const parts = dateStr.split(" "),
            datePart = parts[0].split("-"),
            timePart = parts[1].split(":");
        const dateObj = new Date(datePart[0], datePart[2] - 1, datePart[1], timePart[0], timePart[1], timePart[2]);
        return dateObj
    }
    return dateObj;
}

function ErrorComponent(props) {
    return (
        <Alert onClose={() => {}}>This is a success alert — check it out!</Alert>
    );
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
                    <ListItemText className={classes.notificationText} primary={`Finished moving /iplant/home/ipctest/folder to trash at /iplant/trash/home/de-irods/ipctest/file.b4QI4MO`}></ListItemText>
                    <Typography className={classes.timeStamp}>
                        {formatDistance(new Date("2020-08-20T09:25:31.708Z"), new Date())}
                    </Typography>

                </MenuItem>
            </div>
            <Divider light />
        </>
    );
}


// function NotificationsMenuV2(prop) {
//
//     const { anchorEl } = this.state;
//
//     const [setAnchorEl] = React.useState(null);
//
//     const handleClick = event => {
//         setAnchorEl(event.currentTarget);
//     };
//
//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//
//     const {
//         notifications,
//         unSeenCount,
//         classes,
//         notificationLoading,
//         error,
//     } = this.props;
//     const messages = notifications &&
//     notifications.messages &&
//     notifications.messages.length > 0
//         ? notifications.messages
//         : [];
//
//
//
//     return (
//         <LoadingMask loading={notificationLoading}>
//             {error ? ( <ErrorComponent
//                          classes={classes}
//                          // onClick={{this.props.fetchNotifications}}
//                          />
//             ): messages.length > 0 ? (
//                 messages.map((n) => {
//                 return (
//                     <Notification
//                         key={n.message.id}
//                         notification={n}
//                         onClick={this.onMenuItemSelect}
//                         classes={classes}
//                         />
//                     );
//                 })
//                     .reverse()
//             ) : (
//                 <>
//                     <MenuItem className={classes.menuItem} onClick={handleClose}>
//                         <ListItemText className={classes.notificationText} primary={`No new notifications!`}></ListItemText>
//                         <div className={classes.timeStamp}>{test("2020-08-14 00:00:00")}</div>
//                     </MenuItem>
//                     <Divider light />
//                 </>
//             )
//             }
//
//         </LoadingMask>
//     )
// }


function NotificationMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();

    return (

        <div >
            <NotificationsIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Notifications
            </NotificationsIcon>

            <Menu
                id="notification-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                <Typography
                    className={classes.header}
                    variant="h6">
                    Notifications
                </Typography>

                <Divider/>

                <MenuItem onClick={handleClose}>
                    <ListItemText className={classes.notificationText} primary={`Finished moving /iplant/home/ipctest/folderForDeleteRestore to trash at /iplant/trash/home/de-irods/ipctest/folderForDeleteRestore.b4QI4MO`}></ListItemText>
                        <Typography
                            variant={"subtitle2"}
                            className={classes.timeStamp}>
                            {formatDistance(new Date("2020-08-20T09:25:31.708Z"), new Date())}
                        </Typography>

                </MenuItem>
                <Divider light />

                <Typography
                    onClick={handleClose}
                    className={classes.footer}
                    variant="subtitle1" >
                    VIEW ALL NOTIFICATIONS AND ACTIVITIES
                </Typography>

            </Menu>
        </div>
    );
}

export default NotificationMenu;