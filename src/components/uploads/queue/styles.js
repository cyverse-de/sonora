import { makeStyles } from "@material-ui/core/styles";

const drawerMinHeight = 45;
const drawerMaxHeight = "50%";

const useStyles = makeStyles((theme) => ({
    drawerMax: {
        height: drawerMaxHeight,
        transition: theme.transitions.create("height", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerMin: {
        height: drawerMinHeight,
        transition: theme.transitions.create("height", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    table: {
        minWidth: 650,
    },
    toolBar: {
        backgroundColor: theme.palette.primary.main,
        minHeight: drawerMinHeight,
    },
    toolBarRoot: {
        flexGrow: 1,
    },
    uploadTypography: {
        color: theme.palette.primary.contrastText,
        flexGrow: 1,
    },
    toolBarAction: {
        color: theme.palette.primary.contrastText,
    },
}));

export default useStyles;
