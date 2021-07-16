/**
 *
 * @author sriram
 * A simple dialog to prompt users to login with Agave
 */

import React from "react";
import { useTranslation } from "i18n";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core";
import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

function AgaveAuthPromptDialog(props) {
    const { baseId, location, open, handleClose } = props;
    const { t } = useTranslation("apps");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const redirectUser = () => {
        window.location.replace(location);
        handleClose();
    };
    const dialogTitleId = buildID(
        baseId,
        ids.AGAVE_AUTH_PROMPT_DIALOG,
        ids.AGAVE_AUTH_PROMPT_DIALOG_TITLE
    );
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            id={buildID(baseId, ids.AGAVE_AUTH_PROMPT_DIALOG)}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>
                {t("agaveRedirectTitle")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("agaveRedirectMessage")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    id={buildID(
                        baseId,
                        ids.AGAVE_AUTH_PROMPT_DIALOG,
                        ids.AGAVE_AUTH_PROMPT_DIALOG_DENY_BTN
                    )}
                >
                    {t("declineAuthBtnText")}
                </Button>
                <Button
                    onClick={redirectUser}
                    color="primary"
                    id={buildID(
                        baseId,
                        ids.AGAVE_AUTH_PROMPT_DIALOG,
                        ids.AGAVE_AUTH_PROMPT_DIALOG_AUTH_BTN
                    )}
                >
                    {t("authenticateBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AgaveAuthPromptDialog;
