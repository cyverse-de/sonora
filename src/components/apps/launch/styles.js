export default (theme) => ({
    accordionDetails: { flexDirection: "column" },

    // Keeps the content panel at a static height
    // so the nav buttons don't move around below it.
    stepContainer: {
        height: "55vh",
        overflow: "auto",
    },
    stepContent: {
        height: "50vh",
        overflow: "auto",
        padding: theme.spacing(1),
    },
    appInfoContainer: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    appInfoTypography: {
        color: theme.palette.info.main,
    },
    bottomNavigation: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    bottomNavigationRoot: {
        color: theme.palette.primary.contrastText,
    },
    bottomNavigationAction: {
        margin: theme.spacing(1),
        color: theme.palette.primary.contrastText,
    },
});
