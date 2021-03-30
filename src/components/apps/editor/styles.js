export default (theme) => ({
    accordionDetails: {
        flexDirection: "column",
    },

    deleteIcon: {
        color: theme.palette.error.main,
        backgroundColor: theme.palette.getContrastText(
            theme.palette.error.main
        ),
    },

    flex: { flex: 1 },

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
