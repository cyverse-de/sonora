/**
 *
 * @author aramsey, sriram
 *
 * A component that displays analysis run time and status
 *
 */
import React from "react";
import { Trans, useTranslation } from "i18n";

import { useTheme } from "@mui/material";
import useAnalysisRunTime from "components/analyses/useAnalysisRunTime";
import analysisStatus from "components/models/analysisStatus";

export default function AnalysisSubheader(props) {
    const { analysis, date: formattedDate } = props;
    const { t } = useTranslation(["dashboard", "apps"]);
    const { elapsedTime, totalRunTime } = useAnalysisRunTime(analysis);
    const theme = useTheme();

    const status = analysis.status;
    const statusColor =
        status === analysisStatus.COMPLETED
            ? theme.palette.success.main
            : status === analysisStatus.RUNNING
            ? theme.palette.primary.main
            : status === analysisStatus.FAILED
            ? theme.palette.error.main
            : null;

    return (
        <Trans
            t={t}
            i18nKey={
                totalRunTime
                    ? "analysisCompletedOrigination"
                    : elapsedTime
                    ? "analysisRunningOrigination"
                    : "analysisOrigination"
            }
            values={{
                status,
                date: formattedDate,
                runningTime: elapsedTime,
                totalRunTime,
            }}
            components={{
                bold: <strong />,
                status: <span style={{ color: statusColor }} />,
            }}
        />
    );
}
