export default (theme) => ({
    animationBox: {
        maxWidth: "450px",
        margin: "0 auto",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },

    button: {
        marginRight: theme.spacing(2),
    },

    divider: {
        flexGrow: 1,
    },

    drawerContent: {
        padding: theme.spacing(3),
    },

    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "90%",
        },
    },

    error: {
        color: theme.palette.error.main,
    },

    scrollable: {
        maxHeight: "inherit",
        overflow: "auto",
    },
});
