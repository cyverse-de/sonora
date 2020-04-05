/**
 *
 * @author sriram
 * A simple dialog to prompt users to login with Agave
 */

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { build, getMessage, formatMessage, withI18N } from "@cyverse-de/ui-lib";
import intlData from "./messages";
import ids from "./ids";
import { injectIntl } from "react-intl";

function AgaveAuthPromptDialog(props) {
    const { baseId, location, open, handleClose, intl } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const redirectUser = () => {
        window.location.replace(location);
        handleClose();
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            id={build(baseId, ids.AGAVE_AUTH_PROMPT_DIALOG)}
            fullScreen={fullScreen}
            aria-labelledby={formatMessage(intl, "agaveRedirectTitle")}
        >
            <DialogTitle>{getMessage("agaveRedirectTitle")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {getMessage("agaveRedirectMessage")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    id={build(
                        baseId,
                        ids.AGAVE_AUTH_PROMPT_DIALOG,
                        ids.AGAVE_AUTH_PROMPT_DIALOG_DENY_BTN
                    )}
                >
                    {getMessage("declineAuthBtnText")}
                </Button>
                <Button
                    onClick={redirectUser}
                    color="primary"
                    id={build(
                        baseId,
                        ids.AGAVE_AUTH_PROMPT_DIALOG,
                        ids.AGAVE_AUTH_PROMPT_DIALOG_AUTH_BTN
                    )}
                >
                    {getMessage("authenticateBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default withI18N(injectIntl(AgaveAuthPromptDialog), intlData);
