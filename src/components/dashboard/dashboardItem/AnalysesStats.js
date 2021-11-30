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
import constants from "../../../constants";
import { formatFileSize } from "components/data/utils";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { Typography, Divider, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { getUnixTime, parseISO } from "date-fns";
import {
    getFormattedDistance,
    formatDateObject,
} from "components/utils/DateFormatter";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const options = {
    indexAxis: "y",
    plugins: {
        title: {
            display: true,
            text: "Analyses Stats",
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
        },
        y: {
            stacked: true,
        },
    },
};

const labels = ["Analyses"];

export const getFormattedData = (data) => {
    return {
        labels,
        datasets: [
            {
                label: "Completed",
                data: [
                    data["status-count"].find((x) => x.status === "Completed")
                        ?.count || 0,
                ],
                backgroundColor: "rgb(75, 192, 192)",
            },
            {
                label: "Canceled",
                data: [
                    data["status-count"].find((x) => x.status === "Canceled")
                        ?.count || 0,
                ],
                backgroundColor: "rgb(255, 200, 132)",
            },

            {
                label: "Failed",
                data: [
                    data["status-count"].find((x) => x.status === "Failed")
                        ?.count || 0,
                ],
                backgroundColor: "rgb(255, 0, 0)",
            },
            {
                label: "Submitted",
                data: [
                    data["status-count"].find((x) => x.status === "Submitted")
                        ?.count || 0,
                ],
                backgroundColor: "rgb(0, 50, 200)",
            },
            {
                label: "Running",
                data: [
                    data["status-count"].find((x) => x.status === "Running")
                        ?.count || 0,
                ],
                backgroundColor: "rgb(53, 100, 23)",
            },
        ],
    };
};

export default function AnalysesStats() {
    const { status, data, error } = useQuery([ANALYSES_STATS_QUERY_KEY], () =>
        getAnalysesStats()
    );
    if (status === "error") {
        return (
            <>
                <ErrorTypographyWithDialog error={error} />
            </>
        );
    }
    if (status === "loading") {
        return (
            <>
                <Skeleton variant="rect" width={200} height={200} />
            </>
        );
    }
    return <Bar height={200} options={options} data={getFormattedData(data)} />;
}
