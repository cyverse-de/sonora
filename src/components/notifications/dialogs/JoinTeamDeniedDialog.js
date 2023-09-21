/**
 * @author aramsey
 *
 * A dialog for users to view why their request to join a team was denied.
 * The message in the dialog is an optional message from the team admin
 * who reviewed the user's request.
 */
import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";
import DEDialog from "../../utils/DEDialog";
import buildID from "components/utils/DebugIDUtil";
import { Button, TextField, Typography } from "@mui/material";
import { useNotifications } from "contexts/pushNotifications";

function JoinTeamDeniedDialog(props) {
    const { open, onClose, adminMessage, teamName } = props;
    const { t } = useTranslation(["notifications", "common"]);
    const { setSelectedNotification } = useNotifications();

    const handleClose = () => {
        setSelectedNotification(null);
        onClose();
    };

    const baseId = ids.DENY_REQUEST_DLG;

    return (
        <DEDialog
            baseId={ids.DENY_REQUEST_DLG}
            open={open}
            onClose={handleClose}
            onConfirm={handleClose}
            title={t("denyDetailsHeader")}
            actions={
                <Button
                    color="primary"
                    id={buildID(baseId, ids.OK_BTN)}
                    onClick={handleClose}
                >
                    {t("common:ok")}
                </Button>
            }
        >
            <Typography>
                {t("denyDetailsMessage", { team: teamName })}
            </Typography>
            <TextField
                id={buildID(baseId, ids.DENY_MSG)}
                label={t("denyAdminLabel")}
                multiline
                rows={3}
                margin="dense"
                variant="outlined"
                fullWidth={true}
                value={adminMessage}
                InputProps={{
                    readOnly: true,
                }}
            />
        </DEDialog>
    );
}

export default JoinTeamDeniedDialog;
