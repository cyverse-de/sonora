/**
 * @author aramsey
 *
 * A dialog to inform users that analysis output folders are not created
 * until after the job has terminated.
 */

import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { Button, Typography } from "@mui/material";

import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import ids from "./ids";
import { ANALYSIS_TERMINAL_STATES } from "./utils";

function PendingTerminationDlg(props) {
    const { open, onClose, analysisName, analysisStatus } = props;
    const { t } = useTranslation("analyses");
    const dialogId = ids.PENDING_TERMINATION_DLG;
    const terminalStatesStr = ANALYSIS_TERMINAL_STATES.join(", ");

    return (
        <DEDialog
            baseId={dialogId}
            title={t("pendingTerminationTitle")}
            open={open}
            onClose={onClose}
            actions={
                <Button
                    id={buildID(dialogId, ids.DIALOG.CLOSE)}
                    onClick={() => {
                        onClose();
                    }}
                >
                    {t("close")}
                </Button>
            }
        >
            <Typography>
                {t("pendingTerminationMessage", {
                    name: analysisName,
                    status: analysisStatus,
                    terminalStates: terminalStatesStr,
                })}
            </Typography>
        </DEDialog>
    );
}

export default PendingTerminationDlg;
