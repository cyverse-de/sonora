/**
 * A dialog component to display the App launch run error code.
 *
 * @author sriram, psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import { ERROR_CODES } from "components/error/errorCode";
import DEDialog from "components/utils/DEDialog";
import RunError from "./RunError";

import { Button, Typography } from "@mui/material";

const RunErrorDialog = (props) => {
    const { baseId, code, open, viceQuota, runningJobs, onClose } = props;

    const { t } = useTranslation(["launch", "common"]);

    let title;
    if (code === ERROR_CODES.ERR_LIMIT_REACHED) {
        title = t("jobLimitReached");
    } else if (code === ERROR_CODES.ERR_FORBIDDEN) {
        title = t("accessDenied");
    }

    return (
        <DEDialog
            baseId={baseId}
            title={title}
            open={open}
            actions={
                <Button variant="contained" onClick={onClose}>
                    {t("common:ok")}
                </Button>
            }
            onClose={onClose}
        >
            <Typography>
                <RunError
                    code={code}
                    viceQuota={viceQuota}
                    runningJobs={runningJobs}
                />
            </Typography>
        </DEDialog>
    );
};

export default RunErrorDialog;
