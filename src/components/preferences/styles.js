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
        marginLeft: "2%",
        fontSize: 20,
    },

    textField: {
        width: "60%",
        marginLeft: "5%",
    },

    webhooksTextField: {
        width: "50%",
    },

    dropDown: {
        width: "20%",
        marginLeft: "3%",
        marginRight: "3%",
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
        marginTop: -1,
        width: "6%",
        fullWidth: false,
        size: "small",
        textAlign: "center",
    },

    blackButton: {
        backgroundColor: "black",
    },

    section: {
        marginLeft: "3%",
    },
});
