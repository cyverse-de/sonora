export default (theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },

    centeredImage: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },

    drawerContent: {
        padding: theme.spacing(3),
    },

    typographyMessage: {
        marginBottom: theme.spacing(4), // gutterBottom wasn't enough space
    },

    error: {
        color: theme.palette.error.main,
    },
});
