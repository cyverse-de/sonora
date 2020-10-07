export default (theme) => ({
    table: {
        overflow: "auto",
        height: "75%",
    },
    tableHead: {
        backgroundColor: theme.palette.primary.main,
        position: "sticky",
        top: 0,
    },
    container: {
        width: "100%",
        height: "100%",
        marginTop: 0,
        overflow: "auto",
    },
    toolbarButton: {
        marginRight: 20,
        textTransform: "none",
    },
    toolbar: {
        backgroundColor: theme.palette.lightSilver,
        borderBottom: "solid 2px",
        borderColor: theme.palette.silver,
        height: 55,
    },
    notification: {
        textDecoration: "underline",
        cursor: "pointer",
    },
    unSeenNotificationBackground: {
        backgroundColor: theme.palette.secondary.main,
    },
    dropDown: {
        margin: 3,
        height: 40,
        flexDirection: "unset",
    },
    dropDownLabel: {
        paddingLeft: 5,
        fontSize: 10,
    },
});
