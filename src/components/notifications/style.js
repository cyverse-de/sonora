import { palette } from "@cyverse-de/ui-lib";

export default (theme) => ({
    table: {
        overflow: "auto",
        height: "75%",
    },
    tableHead: {
        backgroundColor: palette.blue,
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
        backgroundColor: palette.lightGray,
        borderBottom: "solid 2px",
        borderColor: palette.gray,
        height: 55,
    },
    notification: {
        textDecoration: "underline",
        cursor: "pointer",
    },
    unSeenNotificationBackground: {
        backgroundColor: palette.lightBlue,
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
