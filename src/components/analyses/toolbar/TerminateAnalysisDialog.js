/**
 * @author aramsey
 *
 * A dialog to confirm that the user wants to terminate (Cancel, or Save and Complete)
 * whatever analyses are selected.
 */

import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { Button, Typography } from "@material-ui/core";

import { groupBy } from "common/functions";
import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import ids from "../ids";
import { isInteractive } from "../utils";

function TerminateAnalysisDialog(props) {
    const {
        open,
        onClose,
        getSelectedAnalyses,
        handleSaveAndComplete,
        handleCancel,
    } = props;
    const { t } = useTranslation("analyses");
    const dialogId = ids.TERMINATE_ANALYSIS_DLG;

    const selectedAnalyses = getSelectedAnalyses();
    const analysisCount = selectedAnalyses?.length;

    const handleTerminateConfirmed = () => {
        const mapIsVice = groupBy(selectedAnalyses, isInteractive);
        const viceAnalyses = mapIsVice?.true;
        const condorAnalyses = mapIsVice?.false;

        handleSaveAndComplete(viceAnalyses);
        handleCancel(condorAnalyses);
    };

    return (
        <DEDialog
            baseId={dialogId}
            title={t("terminateAnalysisTitle", { count: analysisCount })}
            open={open}
            onClose={onClose}
            actions={
                <>
                    <Button
                        id={buildID(dialogId, ids.DIALOG.CANCEL)}
                        onClick={() => {
                            onClose();
                        }}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        id={buildID(dialogId, ids.TERMINATE_BTN)}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            onClose();
                            handleTerminateConfirmed();
                        }}
                    >
                        {t("terminateBtn")}
                    </Button>
                </>
            }
        >
            <Typography>
                {t("terminateAnalysisMessage", { count: analysisCount })}
            </Typography>
        </DEDialog>
    );
}

export default TerminateAnalysisDialog;
