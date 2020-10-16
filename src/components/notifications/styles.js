export default (theme) => ({
    divider: {
        flexGrow: 1,
    },
    filter: {
        width: 200,
    },
    header: {
        marginLeft: theme.spacing(1),
    },
    notification: {
        textDecoration: "underline",
        cursor: "pointer",
    },
    timeStamp: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.5),
    },
    toolbarButton: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
    unSeenNotificationBackground: {
        backgroundColor: theme.palette.secondary.main,
    },
    markSeen: { position: "absolute", right: theme.spacing(0.5), top: 0 },
    viewAll: {
        position: "absolute",
        right: theme.spacing(5),
        top: 0,
    },
});
