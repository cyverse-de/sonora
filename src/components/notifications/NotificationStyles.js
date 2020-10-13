export default (theme) => ({
    timeStamp: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },

    notificationsRow: {
        marginLeft: theme.spacing(1.5),
    },

    menuItem: {
        display: "in-line",
    },

    header: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },

    footer: {
        color: theme.palette.primary.main,
        float: "left",
        textAlign: "left",
        display: "block",
        width: "100%",
    },
});
