const styles = (theme) => ({
    expansionDetails: {
<<<<<<< HEAD
        flexDirection: "column",
=======
        display: "inherit",
>>>>>>> 3171764... Formik forms for Add / Edit tool.
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

<<<<<<< HEAD
=======
    toolTypeSelector: {
        width: theme.spacing(20),
    },

>>>>>>> 3171764... Formik forms for Add / Edit tool.
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
<<<<<<< HEAD
        color: theme.palette.error.main,
    },
    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
=======
        "&:hover": {
            backgroundColor: theme.palette.error.main,
        },
>>>>>>> 3171764... Formik forms for Add / Edit tool.
    },
});

export default styles;
