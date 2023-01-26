/**
 * @author sboleyn
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
import SubscriptionErrorHandler from "./SubscriptionErrorHandler";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.error.main,
        padding: theme.spacing(1),
    },
}));

function SubscriptionErrorDialog(props) {
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
                <SubscriptionErrorHandler
                    errorObject={errorObject}
                    baseId={baseId}
                />
            </DialogContent>
        </Dialog>
    );
}

export default SubscriptionErrorDialog;
