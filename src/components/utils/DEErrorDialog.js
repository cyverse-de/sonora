/**
 * @author sriram
 *  Wraps ErrorHandler in a Dialog
 *
 **/

import React from "react";
import { getMessage, withI18N } from "@cyverse-de/ui-lib";
import messages from "./messages";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import ErrorHandler from "./ErrorHandler";
import { injectIntl } from "react-intl";

function DEErrorDialog(props) {
    const { errorObject, open, baseId, handleClose } = props;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <ErrorHandler errorObject={errorObject} baseId={baseId} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    {getMessage("ok")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default withI18N(injectIntl(DEErrorDialog), messages);
