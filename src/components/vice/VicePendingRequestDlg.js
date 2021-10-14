/**
 * @author aramsey
 *
 * A dialog to display to users when they click on a VICE app and they've
 * already submitted a request for VICE access that is still awaiting
 * admin review.
 */
import React from "react";

import { Button, Typography } from "@material-ui/core";

import buildID from "components/utils/DebugIDUtil";
import DEDialog from "components/utils/DEDialog";
import { useTranslation } from "i18n";
import ids from "./ids";

function VicePendingRequestDlg(props) {
    const { open, onClose } = props;
    const { t } = useTranslation(["vice", "common"]);

    const dialogId = ids.VICE_PENDING_REQUEST_DLG;
    return (
        <DEDialog
            open={open}
            onClose={onClose}
            baseId={dialogId}
            title={t("pendingRequestTitle")}
            actions={
                <Button id={buildID(dialogId, ids.CLOSE_BTN)} onClick={onClose}>
                    {t("common:close")}
                </Button>
            }
        >
            <Typography>{t("pendingRequestMessage")}</Typography>
        </DEDialog>
    );
}

export default VicePendingRequestDlg;
