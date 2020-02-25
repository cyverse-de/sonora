export default (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
    },

    preferences: {
        fontSize: 14,
    },

    toggle: {
        float: "right",
        marginRight: "10%",
    },

    sectionHeader: {
        fontFamily: "roboto",
        fontSize: 20,
    },

    textField: {
        width: "60%",
    },

    actionButton: {
        fontSize: 16,
        marginTop: 5,
        marginLeft: 5,
    },

    dividers: {
        backgroundColor: theme.palette.blue,
        marginTop: "1%",
        marginBottom: "1%",
        variant: "middle",
    },

    shortcut: {
        float: "right",
    },

    shortcutField: {
        marginLeft: 3,
        paddingBottom: 10,
        width: "6%",
        fullWidth: true,
        size: "small",
        textAlign: "center",
    },
});
