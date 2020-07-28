export default (theme) => ({
    accordionDetails: { flexDirection: "column" },

    stepper: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },
    stepContainer: {
        overflow: "auto",
    },
    stepContent: {
        overflow: "auto",
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0.3),
        },
    },
    appInfoContainer: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },
    appInfoTypography: {
        color: theme.palette.info.main,
        width: "100%",
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
    paramsSectionHeader: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(0.3),
            marginBottom: theme.spacing(0.3),
        },
    },

    paramsReview: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.3),
        },
    },

    inputSelectorBrowseButton: { marginLeft: theme.spacing(1) },
    inputSelectorTextFiled: { paddingRight: theme.spacing(1) },
});
