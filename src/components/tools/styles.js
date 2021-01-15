const styles = (theme) => ({
    expansionDetails: {
        flexDirection: "column",
    },

    paper: {
        padding: theme.spacing(1),
    },

    addBtn: {
        marginRight: theme.spacing(1),
    },

    toolbar: {
        backgroundColor: theme.palette.lightGray,
        "& div": {
            marginRight: theme.spacing(2),
        },
        "& button": {
            marginRight: theme.spacing(2),
        },
        "& svg": {
            color: theme.palette.darkBlue,
        },
    },

    container: {
        height:
            "calc(100% - " +
            theme.mixins.toolbar["@media (min-width:600px)"].minHeight +
            "px)",
        overflow: "auto",
    },

    tablePagination: {
        height: "40",
    },

    deleteBtn: {
        color: theme.palette.error.main,
    },
    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
    },
});

export default styles;
