export default (theme) => ({
    accordionDetails: {
        flexDirection: "column",
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1),
        },
    },

    deleteIcon: {
        color: theme.palette.error.main,
        backgroundColor: theme.palette.getContrastText(
            theme.palette.error.main
        ),
    },

    formContainer: {
        padding: theme.spacing(1),
    },

    paramCard: {
        margin: theme.spacing(1, 0),
    },
    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
    },
});
