export default (theme) => ({
    divider: {
        flexGrow: 1,
    },
    filter: {
        width: 200,
    },
    header: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    notification: {
        textDecoration: "underline",
        cursor: "pointer",
    },
    timeStamp: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
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
});
