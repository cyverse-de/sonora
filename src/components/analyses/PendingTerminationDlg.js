/**
 * @author aramsey
 *
 * A dialog to inform users that analysis output folders are not created
 * until after the job has terminated.
 */

import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, Typography } from "@material-ui/core";

import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import ids from "./ids";

function PendingTerminationDlg(props) {
    const { open, onClose, analysisName } = props;
    const { t } = useTranslation("analyses");
    const dialogId = ids.PENDING_TERMINATION_DLG;

    return (
        <DEDialog
            baseId={dialogId}
            title={t("pendingTerminationTitle")}
            open={open}
            onClose={onClose}
            actions={
                <Button
                    id={build(dialogId, ids.DIALOG.CLOSE)}
                    onClick={() => {
                        onClose();
                    }}
                >
                    {t("close")}
                </Button>
            }
        >
            <Typography>
                {t("pendingTerminationMessage", { name: analysisName })}
            </Typography>
        </DEDialog>
    );
}

export default PendingTerminationDlg;
