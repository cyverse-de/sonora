/**
 *
 * @author sriram
 * A simple dialog to prompt users to login with Tapis
 */

import React from "react";
import { useTranslation } from "i18n";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

function TapisAuthPromptDialog(props) {
    const { baseId, location, open, handleClose } = props;
    const { t } = useTranslation("apps");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const redirectUser = () => {
        window.location.replace(location);
        handleClose();
    };
    const dialogTitleId = buildID(
        baseId,
        ids.TAPIS_AUTH_PROMPT_DIALOG,
        ids.TAPIS_AUTH_PROMPT_DIALOG_TITLE
    );
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            id={buildID(baseId, ids.TAPIS_AUTH_PROMPT_DIALOG)}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>
                {t("tapisRedirectTitle")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("tapisRedirectMessage")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    id={buildID(
                        baseId,
                        ids.TAPIS_AUTH_PROMPT_DIALOG,
                        ids.TAPIS_AUTH_PROMPT_DIALOG_DENY_BTN
                    )}
                >
                    {t("declineAuthBtnText")}
                </Button>
                <Button
                    onClick={redirectUser}
                    variant="contained"
                    id={buildID(
                        baseId,
                        ids.TAPIS_AUTH_PROMPT_DIALOG,
                        ids.TAPIS_AUTH_PROMPT_DIALOG_AUTH_BTN
                    )}
                >
                    {t("authenticateBtnText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TapisAuthPromptDialog;
