const styles = (theme) => ({
    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
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
});

export default styles;
