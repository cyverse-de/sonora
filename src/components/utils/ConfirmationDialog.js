/**
 * A general purpose OK/Cancel confirmation dialog.
 *
 * @author psarando
 */
import React from "react";
import { useTranslation } from "i18n";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";

function ConfirmationDialog({
    baseId,
    open,
    onClose,
    onConfirm,
    title,
    contentText,
}) {
    const theme = useTheme();
    const { t } = useTranslation("common");
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const dialogTitleId = build(baseId, ids.DIALOG.TITLE);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            id={baseId}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{contentText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button id={build(baseId, ids.DIALOG.CANCEL)} onClick={onClose}>
                    {t("cancel")}
                </Button>
                <Button
                    id={build(baseId, ids.DIALOG.CONFIRM)}
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                >
                    {t("ok")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
