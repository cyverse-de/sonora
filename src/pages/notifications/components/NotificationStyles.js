import { createStyles } from "@material-ui/core";
const NotificationStyles = (theme) =>
    createStyles({
        timeStamp: {
            color: "grey",
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(2),
        },

        menuItem: {
            display: "in-line",
        },

        notificationText: {
            float: "left",
            display: "flex",
            width: "12r",
            textOverflow: "ellipsis",
            overflow: "hidden",
            noWrap: true,
        },

        notificationsRow: {
            marginLeft: theme.spacing(2),
        },

        header: {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(2),
        },

        footer: {
            color: theme.palette.primary.main,
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(2),
        },
    });

export default NotificationStyles;
