/**
 *
 * @author sriram
 * An icon for displaying analysis
 *
 */
import React from "react";

import analysisStatus from "components/models/analysisStatus";
import { Avatar, useTheme } from "@material-ui/core";
import palette from "components/theme/default/CyVersePalette";

import {
    GetApp as SubmittedIcon,
    DirectionsRun as RunningIcon,
    Done as CompletedIcon,
    Cancel as CancelledIcon,
    Error as FailedIcon,
} from "@material-ui/icons";

export default function AnalysisStatusIcon({ status }) {
    const theme = useTheme();
    switch (status) {
        case analysisStatus.SUBMITTED:
            return (
                <Avatar style={{ backgroundColor: palette.indigo }}>
                    <SubmittedIcon />
                </Avatar>
            );
        case analysisStatus.RUNNING:
            return (
                <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
                    <RunningIcon />
                </Avatar>
            );
        case analysisStatus.COMPLETED:
            return (
                <Avatar style={{ backgroundColor: theme.palette.success.main }}>
                    <CompletedIcon />
                </Avatar>
            );
        case analysisStatus.CANCELLED:
            return (
                <Avatar style={{ backgroundColor: theme.palette.warning.main }}>
                    <CancelledIcon />
                </Avatar>
            );
        case analysisStatus.FAILED:
            return (
                <Avatar style={{ backgroundColor: theme.palette.error.main }}>
                    <FailedIcon />
                </Avatar>
            );
        default:
            return (
                <Avatar style={{ backgroundColor: palette.indigo }}>
                    <SubmittedIcon />
                </Avatar>
            );
    }
}
