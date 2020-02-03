export default (theme) => ({
    dataLink: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            color: theme.palette.primary.main,
        },
    },

    skeleton: {
        backgroundColor: theme.palette.lightGray,
    },
});
