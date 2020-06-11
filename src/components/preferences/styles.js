export default (theme) => ({
    root: {
        width: "100%",
    },

    grid: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
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
        [theme.breakpoints.down("sm")]: {
            width: 200,
        },
    },

    dividers: {
        backgroundColor: theme.palette.blue,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },

    shortcutField: {
        marginLeft: theme.spacing(1),
        width: 30,
    },

    section: {
        marginLeft: theme.spacing(1),
    },
});
