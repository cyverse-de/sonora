const styles = (theme) => ({
    bottomPadding: {
        paddingBottom: theme.spacing(1),
    },

    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },

    closeButton: {
        float: "right",
    },

    deleteBtn: {
        color: theme.palette.error.main,
    },

    divider: {
        flexGrow: 1,
    },

    filter: {
        width: 200,
        marginRight: theme.spacing(2),
    },

    paper: {
        padding: theme.spacing(1),
    },

    popover: {
        padding: theme.spacing(2),
    },
});

export default styles;
