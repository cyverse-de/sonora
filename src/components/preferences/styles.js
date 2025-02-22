const styles = (theme) => ({
    root: {
        overflowY: "auto",
        width: "100%",
        overflowX: "hidden",
    },

    grid: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("md")]: {
            margin: theme.spacing(0.1),
        },
    },

    sectionHeader: {
        color: theme.palette.info.main,
        marginLeft: theme.spacing(1),
    },

    textField: {
        width: 300,
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("md")]: {
            width: 200,
        },
    },

    dividers: {
        backgroundColor: theme.palette.blue,
        margin: theme.spacing(1),
    },

    shortcutField: {
        marginLeft: theme.spacing(1),
        width: 100,
        top: -9,
    },

    section: {
        marginLeft: theme.spacing(1),
    },

    browseButton: {
        marginTop: theme.spacing(1.2),
        marginLeft: theme.spacing(1),
    },

    actionButton: {
        margin: theme.spacing(1),
    },
});

export default styles;
