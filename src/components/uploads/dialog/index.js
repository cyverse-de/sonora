import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
} from "@material-ui/core";

import { useTheme } from "@material-ui/styles";

import UploadQueue from "../queue";

export default function UploadDialog({ open, handleClose = () => {} }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
            <DialogTitle id="upload-dialog">Upload Queue</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    The list of uploads running in this browser tab or window.
                    Closing this tab/window will terminate the uploads. However,
                    uploads will continue to run if this dialog is closed.
                </DialogContentText>

                <UploadQueue />

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
