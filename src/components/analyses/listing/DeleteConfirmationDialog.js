/**
 * A confirmation dialog for deleting analyses.
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

import ids from "../ids";

function DeleteConfirmationDialog({ baseId, open, onClose, confirmDelete }) {
    const theme = useTheme();
    const { t } = useTranslation("analyses");
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const dialogTitleId = build(baseId, ids.DIALOG.DELETE, ids.DIALOG.TITLE);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            id={build(baseId, ids.DIALOG.DELETE)}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>{t("delete")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("analysesExecDeleteWarning")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    id={build(baseId, ids.DIALOG.DELETE, ids.DIALOG.CANCEL)}
                    onClick={onClose}
                >
                    {t("cancelBtnText")}
                </Button>
                <Button
                    id={build(baseId, ids.DIALOG.DELETE, ids.DIALOG.CONFIRM)}
                    onClick={confirmDelete}
                    color="primary"
                    variant="contained"
                >
                    {t("okBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmationDialog;
