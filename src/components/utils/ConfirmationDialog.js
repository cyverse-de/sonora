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
} from "@mui/material";

import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

function ConfirmationDialog(props) {
    const {
        baseId,
        open,
        onClose,
        onConfirm,
        confirmButtonText,
        title,
        contentText,
    } = props;

    const theme = useTheme();
    const { t } = useTranslation("common");
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const dialogTitleId = buildID(baseId, ids.DIALOG.TITLE);

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
                <Button
                    id={buildID(baseId, ids.DIALOG.CANCEL)}
                    onClick={onClose}
                >
                    {t("cancel")}
                </Button>
                <Button
                    id={buildID(baseId, ids.DIALOG.CONFIRM)}
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                >
                    {confirmButtonText || t("ok")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
