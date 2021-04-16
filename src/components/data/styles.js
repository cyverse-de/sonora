const dataStyles = (theme) => ({
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

    bottomPadding: {
        paddingBottom: theme.spacing(1),
    },

    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
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

    permissionsList: {
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
        [theme.breakpoints.up("md")]: {
            minWidth: "50%",
        },
        [theme.breakpoints.down("md")]: {
            width: "90%",
        },
        overflow: "hidden",
        height: "100vh",
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

    selectedListItem: {
        paddingLeft: 0,
        color: theme.palette.primary.main,
    },
    list: {
        [theme.breakpoints.down("sm")]: {
            maxWidth: 130,
        },
        padding: 0,
    },
    listItem: {
        outline: "none",
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    },
    listItemText: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 200,
    },
    currentLocationLink: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 140,
    },
    icon: {
        color: theme.palette.info.main,
    },
});
export default dataStyles;
