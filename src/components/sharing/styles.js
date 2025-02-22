const styles = (theme) => ({
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

    icon: {
        color: theme.palette.info.main,
        fontSize: "1.5rem",
    },

    mobilePermission: {
        paddingLeft: theme.spacing(9),
        paddingBottom: theme.spacing(2),
    },

    typographyPadding: {
        paddingBottom: theme.spacing(1),
    },
});

export default styles;
