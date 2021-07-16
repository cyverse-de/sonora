/**
 * @author sriram
 *  Wraps ErrorHandler in a Dialog
 *
 **/

import React from "react";
import { useTranslation } from "i18n";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ErrorHandler from "./ErrorHandler";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.error.main,
        padding: theme.spacing(1),
    },
}));

function DEErrorDialog(props) {
    const { errorObject, open, baseId, handleClose } = props;
    const { t } = useTranslation("util");
    const classes = useStyles();
    return (
        <Dialog open={open} onClose={handleClose} scroll="body">
            <DialogTitle>
                <IconButton
                    aria-label={t("close")}
                    className={classes.closeButton}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ErrorHandler errorObject={errorObject} baseId={baseId} />
            </DialogContent>
        </Dialog>
    );
}

export default DEErrorDialog;
