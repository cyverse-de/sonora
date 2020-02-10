export default (theme) => ({
    button: {
        [theme.breakpoints.up("sm")] : {
            margin: theme.spacing(1),
        }
    },

    buttonIcon: {
        [theme.breakpoints.up("sm")] : {
            marginRight: theme.spacing(1),
        }
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

    menuButton: {
        color: theme.palette.white,
    },

    skeleton: {
        backgroundColor: theme.palette.lightGray,
    },

    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },

    whiteDotMenu: {
        color: theme.palette.white,
    },
});
