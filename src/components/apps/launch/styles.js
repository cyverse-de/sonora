export default (theme) => ({
    accordionDetails: { flexDirection: "column" },

    stepContainer: {
        overflow: "auto",
    },
    stepContent: {
        overflow: "auto",
        padding: theme.spacing(1),
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
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    bottomNavigationAction: {
        margin: theme.spacing(1),
        color: theme.palette.primary.contrastText,
    },
    paramsSectionHeader: {
        marginTop: 8,
        marginBottom: 8,
    },
});
