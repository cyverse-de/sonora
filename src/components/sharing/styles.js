export default (theme) => ({
    button: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
    chip: {
        marginBottom: theme.spacing(1),
    },

    closeButton: {
        float: "right",
    },

    dividerGrid: {
        maxWidth: theme.spacing(2),
    },

    mobilePermission: {
        paddingLeft: theme.spacing(9),
        paddingBottom: theme.spacing(2),
    },

    typographyPadding: {
        paddingBottom: theme.spacing(1),
    },
});
