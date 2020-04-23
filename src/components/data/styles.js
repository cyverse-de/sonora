export default (theme) => ({
    avatarRead: {
        color: theme.palette.success.contrastText,
        backgroundColor: theme.palette.success.main,
    },

    avatarWrite: {
        color: theme.palette.warning.contrastText,
        backgroundColor: theme.palette.warning.main,
    },

    avatarOwn: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
    },

    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },

    buttonIcon: {
        [theme.breakpoints.up("sm")]: {
            marginRight: theme.spacing(1),
        },
    },

    closeButton: {
        float: "right",
    },

    dataLink: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            color: theme.palette.primary.main,
        },
    },

    divider: {
        flexGrow: 1,
    },

    dividerMargins: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },

    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "90%",
        },
    },

    drawerHeader: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },

    inputLabel: {
        marginTop: theme.spacing(1),
        color: theme.palette.text.primary,
    },

    list: {
        width: "100%",
    },

    menuButton: {
        color: theme.palette.primary.contrastText,
    },

    resourceIcon: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
    },

    restrictWidth: {
        maxWidth: "100%",
        wordBreak: "break-word",
    },

    selectionDrawer: {
        [theme.breakpoints.up("sm")]: {
            width: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            width: "90%",
        },
    },

    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
    },

    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },

    tagPaper: {
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        "& > div": {
            margin: theme.spacing(0.5),
        },
    },

    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },

    whiteDotMenu: {
        color: theme.palette.primary.contrastText,
    },
});
