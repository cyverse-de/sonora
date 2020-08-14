import { createStyles } from "@material-ui/core";
const NotificationStyles = (theme) =>
    createStyles({
        stamp: {
            fontSize: 12,
            color: "grey",
            paddingRight: "10px",
            paddingLeft: "20px",
            display: "list-item",
            alignBox: "right",
            justifyContent: "right",
        },

        timeStamp: {
            fontSize: 12,
            color: "grey",
            content: "",
            padding: "lem",
            marginBottom: "1",
            borderTop: "1",
            float: "right",
            paddingLeft: "25px",
        },

        menuItem: {
            paddingLeft: "25px",
            display: "in-line",
        },

        dateStamp: {},

        notificationText: {
            float: "left",
            paddingRight: "25px",
            display: "flex",
            marginRight: "25px",
            borderRight: "25px",
            textOverflow: "ellipsis",
        },

        notificationsRow: {
            paddingLeft: "25px",
            position: "absolute",
            display: "block",
        },

        previewHeader: {
            fontSize: 16,
            paddingLeft: "25px",
            display: "flex",
        },

        line: {
            color: theme.palette.lightGray,
            borderTop: 0,
            marginTop: 0,
            margin: 0,
        },
        previewFooter: {
            fontSize: 923238, // problem: fontSize style not responsive
            color: theme.palette.primary.main,
            style: "bold",
            paddingTop: "10px",
            paddingLeft: "25px",
            paddingBottom: "5px",
        },
    });

export default NotificationStyles;
