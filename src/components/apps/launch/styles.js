export default (theme) => ({
    accordionDetails: { flexDirection: "column" },

    stepper: {
        padding: theme.spacing(1),
    },
    stepContainer: {
        overflow: "auto",

    },
    spacer: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },
    appInfoTypography: {
        color: theme.palette.info.main,
        width: "100%",
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },
    bottomNavigation: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
        backgroundColor: theme.palette.primary.main,
    },
    bottomNavigationAction: {
        flexGrow: 1,
        color: theme.palette.primary.contrastText,
    },
    paramsReview: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },
    paramsViewSummary: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    paramsViewsExpandIcon: {
        color: theme.palette.info.contrastText,
    },
    inputSelectorBrowseButton: {
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(0.1),
        },
    },
    inputSelectorTextFiled: {
        paddingRight: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            paddingRight: theme.spacing(0.1),
        },
    },
});
