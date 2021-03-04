export default (theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },

    centeredImage: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
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
