export default (theme) => ({
    analysesIcon: {
        width: "28px",
    },

    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },

    closeButton: {
        float: "right",
    },

    dividerGrid: {
        maxWidth: theme.spacing(2),
    },

    iconColor: {
        color: theme.palette.info.main,
    },

    mobilePermission: {
        paddingLeft: theme.spacing(9),
        paddingBottom: theme.spacing(2),
    },

    typographyPadding: {
        paddingBottom: theme.spacing(1),
    },
});
