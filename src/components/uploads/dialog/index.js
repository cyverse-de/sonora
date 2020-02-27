import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    useMediaQuery,
} from "@material-ui/core";

import { Close as CloseIcon } from "@material-ui/icons";

import { useTheme, makeStyles } from "@material-ui/styles";

import { getMessage, withI18N, build as buildID } from "@cyverse-de/ui-lib";

import UploadQueue from "../queue";

import messages from "./messages";
import ids from "./ids";

const useStyles = makeStyles((theme) => ({
    closeDialog: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.blueGrey,
    },
}));

const UploadDialog = ({ open, handleClose = () => {} }) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
            <DialogTitle id={buildID(ids.BASE, ids.TITLE)}>
                {getMessage("title")}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {getMessage("help")}
                    <IconButton
                        aria-label="close"
                        id={buildID(ids.BASE, ids.CLOSE_X)}
                        className={classes.closeDialog}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContentText>

                <UploadQueue id={buildID(ids.BASE, ids.LIST)} />
            </DialogContent>

            <DialogActions>
                <Button
                    id={buildID(ids.BASE, ids.CLOSE)}
                    onClick={handleClose}
                    color="primary"
                >
                    {getMessage("close")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withI18N(UploadDialog, messages);
