const styles = (theme) => ({
    divider: {
        flexGrow: 1,
    },
    okBtn: {
        marginLeft: theme.spacing(2),
    },
    searchField: {
        backgroundColor: "white",
    },
    selectionDrawer: {
        [theme.breakpoints.up("md")]: {
            minWidth: "50%",
        },
        [theme.breakpoints.down("md")]: {
            width: "90%",
        },
    },
});

export default styles;
