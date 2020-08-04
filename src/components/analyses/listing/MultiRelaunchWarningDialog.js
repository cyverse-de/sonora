/**
 * A confirmation dialog for relaunching multiple analyses.
 *
 * @author psarando
 */
import React from "react";
import { useTranslation } from "react-i18next";

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

function MultiRelaunchWarningDialog({
    baseId,
    open,
    onClose,
    confirmMultiRelaunch,
}) {
    const theme = useTheme();
    const { t } = useTranslation("analyses");
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const dialogTitleId = build(baseId, ids.DIALOG.RELAUNCH, ids.DIALOG.TITLE);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            id={build(baseId, ids.DIALOG.RELAUNCH)}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>{t("relaunch")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("analysesMultiRelaunchWarning")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    id={build(baseId, ids.DIALOG.RELAUNCH, ids.DIALOG.CANCEL)}
                    onClick={onClose}
                >
                    {t("cancelBtnText")}
                </Button>
                <Button
                    id={build(baseId, ids.DIALOG.RELAUNCH, ids.DIALOG.CONFIRM)}
                    onClick={confirmMultiRelaunch}
                    color="primary"
                    variant="contained"
                >
                    {t("okBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MultiRelaunchWarningDialog;
