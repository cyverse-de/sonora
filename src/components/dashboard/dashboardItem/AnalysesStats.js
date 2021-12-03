/**
 *
 * @author sriram
 *
 * A chart that displays the analyses stats for the user.
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useQuery } from "react-query";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
    getAnalysesStats,
    ANALYSES_STATS_QUERY_KEY,
} from "serviceFacades/dashboard";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import palette from "components/theme/default/CyVersePalette";
import { Skeleton } from "@material-ui/lab";
import analysisStatus from "components/models/analysisStatus";
import { useTheme, Typography } from "@material-ui/core";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const options = (jobTotal, t) => {
    return {
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: [t("analysesStats"), t("totalJobs", { jobTotal })],
            },
            datalabels: {
                display: false,
            },
        },
        responsive: false,
        maintainAspectRatio: false,

        scales: {
            x: {
                stacked: true,
                ticks: {
                    precision: 0,
                },
            },
            y: {
                stacked: true,
            },
        },
    };
};

const labels = ["Analyses"];

const getFormattedData = (data, theme) => {
    const getCount = (status) => {
        let count = data["status-count"].find(
            (x) => x.status === status
        )?.count;
        return count ? count : 0;
    };
    return {
        labels,
        datasets: [
            {
                label: analysisStatus.COMPLETED,
                data: [getCount(analysisStatus.COMPLETED)],
                backgroundColor: theme.palette.success.main,
            },
            {
                label: analysisStatus.CANCELED,
                data: [getCount(analysisStatus.CANCELED)],
                backgroundColor: theme.palette.warning.main,
            },

            {
                label: analysisStatus.FAILED,
                data: [getCount(analysisStatus.FAILED)],
                backgroundColor: theme.palette.error.main,
            },
            {
                label: analysisStatus.SUBMITTED,
                data: [getCount(analysisStatus.SUBMITTED)],
                backgroundColor: palette.indigo,
            },
            {
                label: analysisStatus.RUNNING,
                data: [getCount(analysisStatus.RUNNING)],
                backgroundColor: theme.palette.primary.main,
            },
        ],
    };
};

export default function AnalysesStats() {
    const { t } = useTranslation("dashboard");
    const theme = useTheme();
    const { status, data, error } = useQuery([ANALYSES_STATS_QUERY_KEY], () =>
        getAnalysesStats()
    );
    if (status === "error") {
        return (
            <div style={{ padding: theme.spacing(1) }}>
                <ErrorTypographyWithDialog
                    errorObject={error}
                    errorMessage={t("analysesStatError")}
                />
            </div>
        );
    }
    if (status === "loading") {
        return <Skeleton variant="rect" width={300} height={200} />;
    }
    const jobTotal = data["status-count"].reduce(
        (prev, curr) => prev + curr.count,
        0
    );
    if (jobTotal === 0) {
        return (
            <Typography variant="caption" style={{ padding: theme.spacing(1) }}>
                {t("noAnalysesStats")}
            </Typography>
        );
    }
    return (
        <Bar
            height={200}
            options={options(jobTotal, t)}
            data={getFormattedData(data, theme)}
        />
    );
}
