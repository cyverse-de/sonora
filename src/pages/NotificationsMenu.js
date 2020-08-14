import React from 'react';
import { makeStyles } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItemText from "@material-ui/core/ListItemText";
import TableCell from "@material-ui/core/TableCell";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import NotificationStyles from "../NotificationStyles";
const useStyles = makeStyles(NotificationStyles);
const setDate = '2020-08-09 02:07:10';              // example date

/*
   This function takes a string in format `yyyy-mm-dd  hh:mm:ss` and returns a date object with that
   time
 */
function dateStringToObj(dateStr) {

    const dateObj = new Date();
    if (typeof dateStr === 'string') {
        const parts = dateStr.split(" "),
            datePart = parts[0].split("-"),
            timePart = parts[1].split(":");
        const dateObj = new Date(datePart[0], datePart[1] - 1, datePart[2], timePart[0], timePart[1], timePart[2]);
        return dateObj
    }
    return dateObj;
}

/*
 This function takes in a string representation of a date object and returns the
 time difference in the simplest form
 */
function dateDifference(dateObj) {

    // const randDate = '2020-03-01 02:07:10';              // example date
    const diff = (new Date().getTime() -  dateObj.getTime()) / 1000,
        dayDiff = Math.floor(diff / 86400);

    // if dayDiff is invalid or less than 0
    if (isNaN(dayDiff) || (dayDiff < 0))
        return;

    return dayDiff == 0 && (
        diff < 60 && "Just Now" ||
        diff < 120 && "A minute ago" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        diff < 7200 && "An hour ago" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        dayDiff == 1 && "Yesterday" ||
        dayDiff < 7 && dayDiff + " days ago" ||
        dayDiff > 31 && Math.ceil(dayDiff / 7) + " weeks ago";
}

function dateString(dateStr) {
    const dateObj = dateStringToObj(dateStr);
    return dateDifference(dateObj);
}

function NotificationMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles(),
          rows = props.menuData;


    return (
        <div>
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
                <TableCell className={classes.previewHeader} > Notifications </TableCell>

                <MenuItem className={classes.menuItem} onClick={handleClose}>

                    <div className={classes.notificationText}>
                         <ListItemText primary={`Finished moving /iplant/home/ipctest/folderForDeleteRestore to trash at /iplant/trash/home/de-irods/ipctest/folderForDeleteRestore.b4QI4MO `}></ListItemText>
                    </div>
                    <div className={classes.stamp}>
                        <div className={classes.timeStamp}>24:20:20</div>
                        <div className={classes.dateStamp}> 15/07/20 </div>
                    </div>
                </MenuItem>
                <hr className={classes.line}></hr>

                <MenuItem className={classes.menuItem} onClick={handleClose}>
                    <ListItemText className={classes.notificationText} primary={`user shared analysis2 with you `}></ListItemText>
                    <div className={classes.timeStamp}>{dateString("2020-03-01 02:07:10")}</div>
                </MenuItem>
                <hr className={classes.line}></hr>

                <MenuItem className={classes.menuItem} onClick={handleClose}>
                    <ListItemText className={classes.notificationText} primary={`user shared analysis3 with you `}></ListItemText>
                    <div className={classes.timeStamp}>{dateString("2020-08-14 00:00:00")}</div>
                </MenuItem>
                <hr className={classes.line}></hr>

                <MenuItem className={classes.menuItem} onClick={handleClose}>
                    <ListItemText className={classes.notificationText} primary={`user shared analysis4 with you `}></ListItemText>
                    <div className={classes.timeStamp}>12:59</div>
                </MenuItem>
                <hr className={classes.line}></hr>

                <ListItemText className={classes.previewFooter} onClick={handleClose}> VIEW ALL NOTIFICATIONS AND ACTIVITIES </ListItemText>

            </Menu>
        </div>
    );
}

export default NotificationMenu;