const styles = (theme) => ({
    card: {
        marginTop: theme.spacing(2),
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        width: 200,
    },
    formControl: {
        marginLeft: theme.spacing(1),
    },
    header: {
        marginLeft: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    toolbarButton: {
        [theme.breakpoints.down("sm")]: {
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

export default styles;
