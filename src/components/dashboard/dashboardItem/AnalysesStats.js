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
import { useTheme } from "@material-ui/core";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const options = (jobTotal) => {
    return {
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: ["Analyses Stats", "Total: " + jobTotal],
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
    return {
        labels,
        datasets: [
            {
                label: analysisStatus.COMPLETED,
                data: [
                    data["status-count"].find(
                        (x) => x.status === analysisStatus.COMPLETED
                    )?.count || 0,
                ],
                backgroundColor: theme.palette.success.main,
            },
            {
                label: analysisStatus.CANCELED,
                data: [
                    data["status-count"].find(
                        (x) => x.status === analysisStatus.CANCELED
                    )?.count || 0,
                ],
                backgroundColor: theme.palette.warning.main,
            },

            {
                label: analysisStatus.FAILED,
                data: [
                    data["status-count"].find(
                        (x) => x.status === analysisStatus.FAILED
                    )?.count || 0,
                ],
                backgroundColor: theme.palette.error.main,
            },
            {
                label: analysisStatus.SUBMITTED,
                data: [
                    data["status-count"].find((x) => x.status === analysisStatus.SUBMITTED)
                        ?.count || 0,
                ],
                backgroundColor: palette.indigo,
            },
            {
                label: analysisStatus.RUNNING,
                data: [
                    data["status-count"].find((x) => x.status === analysisStatus.RUNNING)
                        ?.count || 0,
                ],
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
            <ErrorTypographyWithDialog
                errorObject={error}
                errorMessage={t("analysesStatError")}
            />
        );
    }
    if (status === "loading") {
        return <Skeleton variant="rect" width={300} height={200} />;
    }
    const jobTotal = data["status-count"].reduce(
        (prev, curr) => prev + curr.count,
        0
    );
    return (
        <Bar
            height={200}
            options={options(jobTotal)}
            data={getFormattedData(data, theme)}
        />
    );
}
