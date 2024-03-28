const styles = (theme) => ({
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
        [theme.breakpoints.up("xl")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("xl")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("md")]: {
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

export default styles;
