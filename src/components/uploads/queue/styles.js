/**
 * @author johnworth
 *
 * Styles for the upload queue.
 *
 * @module UploadQueue
 */

import { makeStyles } from "@material-ui/core/styles";

export const drawerMinHeight = 50;
export const drawerMaxHeight = "33%";

const useStyles = makeStyles((theme) => ({
    closable: {
        display: "flex",
        flexDirection: "column",
    },
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
        flexGrow: 0,
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
