/**
 * A confirmation dialog for relaunching multiple analyses.
 *
 * @author psarando
 */
import React from "react";

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

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import messages from "../messages";
import ids from "../ids";

function MultiRelaunchWarningDialog({
    baseId,
    open,
    onClose,
    confirmMultiRelaunch,
}) {
    const theme = useTheme();
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
            <DialogTitle id={dialogTitleId}>
                {getMessage("relaunch")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {getMessage("analysesMultiRelaunchWarning")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    id={build(baseId, ids.DIALOG.RELAUNCH, ids.DIALOG.CANCEL)}
                    onClick={onClose}
                >
                    {getMessage("cancelBtnText")}
                </Button>
                <Button
                    id={build(baseId, ids.DIALOG.RELAUNCH, ids.DIALOG.CONFIRM)}
                    onClick={confirmMultiRelaunch}
                    color="primary"
                    variant="contained"
                >
                    {getMessage("okBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default withI18N(MultiRelaunchWarningDialog, messages);
