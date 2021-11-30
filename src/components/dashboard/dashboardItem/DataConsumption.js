/**
 *
 * @author sriram
 *
 * A chart that displays the data consumption of the user.
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
import { getDataUsage, DATA_USAGE_QUERY_KEY } from "serviceFacades/dashboard";
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

const options = (usage, quota, date, distance, title, theme, t) => {
    return {
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: [title, date],
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        return label;
                    },
                    footer: function (context) {
                        return t("dataConsumptionTimestamp", { distance });
                    },
                },
                xAlign: "right",
                yAlign: "top",
            },
            datalabels: {
                display: () => (100 * usage) / quota > 20, //if usage > 10% of quota, show data labels
                backgroundColor: function (context) {
                    return context.dataset.backgroundColor;
                },
                borderRadius: 4,
                color: theme.palette.primary.contrastText,
                font: {
                    weight: "bold",
                },
                formatter: (value) =>
                    `${formatFileSize(value)} of ${formatFileSize(quota)} `,
                padding: 1,
            },
        },
        responsive: false,
        scales: {
            x: {
                stacked: false,
                min: 0,
                max: usage < quota ? quota : usage,
                ticks: {
                    /*  stepSize:
                         usage < quota ? 10 : Math.ceil(usage / quota) * 10, */
                    callback: function (value, index, values) {
                        if (value === quota) {
                            return t("dataQuotaLimit", {
                                limit: formatFileSize(value),
                            });
                        } else {
                            return formatFileSize(value);
                        }
                    },
                },
            },
        },
        y: {
            stacked: false,
        },
    };
};

const labels = [""]; //required for chartjs

const getFormattedData = (usage, quota, theme) => {
    return {
        labels,
        datasets: [
            {
                label: `Using ${formatFileSize(usage)} of ${formatFileSize(
                    quota
                )} `,
                barThickness: 50,
                data: [usage],
                backgroundColor:
                    usage < constants.DATA_STORAGE_QUOTA_LIMIT
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
            },
        ],
    };
};

export default function DataConsumption(props) {
    const quota = constants.DATA_STORAGE_QUOTA_LIMIT;
    const theme = useTheme();
    const { t } = useTranslation("dashboard");
    const { status, data, error } = useQuery([DATA_USAGE_QUERY_KEY], () =>
        getDataUsage()
    );

    const header = (
        <>
            <Typography
                variant="h6"
                style={{
                    color: theme.palette.info.main,
                }}
            >
                {t("resourceUsage")}
            </Typography>
            <Divider
                style={{
                    margin: 0,
                    color: theme.palette.info.main,
                }}
            />
        </>
    );
    if (status === "error") {
        return (
            <>
                {header} <ErrorTypographyWithDialog error={error} />
            </>
        );
    }
    if (status === "loading") {
        return (
            <>
                {header} <Skeleton variant="rect" width={200} height={200} />
            </>
        );
    }
    const isoTime = parseISO(data?.time);
    const unixTime = getUnixTime(isoTime);
    const distance = getFormattedDistance(unixTime);
    const dateObj = new Date(isoTime);

    return (
        <>
            {header}{" "}
            <Bar
                options={options(
                    data?.total,
                    quota,
                    formatDateObject(dateObj),
                    distance,
                    t("dataConsumption"),
                    theme,
                    t
                )}
                data={getFormattedData(data?.total, quota, theme)}
            />
        </>
    );
}
