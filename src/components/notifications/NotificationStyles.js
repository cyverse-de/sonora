export default (theme) =>
    ({
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
            fontFamily: 'Roboto',
            fontWeight: 400,
            float: "left",
            display: "flex",
            width: "12r",
            textOverflow: "ellipsis",
        },

        notificationsRow: {
            marginLeft: theme.spacing(1.5),
        },

        header: {
            fontFamily: 'Roboto',
            fontWeight: 400,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(2),
        },

        footer: {
            color: theme.palette.primary.main,
            textAlign: "left",
            float: "left",
            display: "block",
            width: "100%",
        },
    });

