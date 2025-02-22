const commonStyles = (theme) => ({
    accordionDetails: {
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    },

    deleteIcon: {
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.contrastText,
    },

    formContainer: {
        padding: theme.spacing(1),
    },

    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
    },
});

export default commonStyles;
