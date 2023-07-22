/**
 *
 * @author sriram
 *
 * A chart that displays the CPU consumption of the user.
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

import constants from "../../../constants";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { getErrorCode } from "components/error/errorCode";
import { Typography, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { formatDateObject } from "components/utils/DateFormatter";
import { formatUsagePercentage } from "components/subscriptions/utils";

import { getUserQuota } from "../../../common/resourceUsage";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const options = (usage, quota, timestamp, title, theme, t) => {
    const formatValue = (value) => `${value} ${t("coreHours")}`;
    let divisor =
        quota % 4 === 0
            ? 4
            : quota % 3 === 0
            ? 3
            : quota % 5 === 0
            ? 5
            : quota % 2 === 0
            ? 2
            : 4;
    let maxTicks = 6;
    let stepSize =
        usage <= (quota / divisor) * maxTicks
            ? Math.ceil(quota / divisor)
            : quota;
    return {
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: [
                    title,
                    t("consumptionChartSecondaryTitle", {
                        percentage: formatUsagePercentage(usage, quota),
                        timestamp,
                    }),
                ],
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => context.dataset.label || "",
                },
                xAlign: "right",
                yAlign: "top",
            },
            datalabels: {
                display: () => (100 * usage) / quota > 20, //if usage > 20% of quota, show data labels
                backgroundColor: function (context) {
                    return context.dataset.backgroundColor;
                },
                borderRadius: 4,
                color: theme.palette.primary.contrastText,
                font: {
                    weight: "bold",
                },
                formatter: (value) => `${t("coreHoursUsed", { value, quota })}`,
                padding: 1,
            },
        },
        responsive: false,
        scales: {
            x: {
                barThickness: "flex",
                stacked: false,
                min: 0,
                max: Math.max(Math.ceil(usage / stepSize) * stepSize, quota),
                ticks: {
                    stepSize: stepSize,
                    callback: function (value, index, values) {
                        if (value === quota) {
                            return t("quotaLimit", {
                                limit: formatValue(value),
                            });
                        } else {
                            return formatValue(value);
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
                label: `Using ${usage} of ${quota} `,
                barThickness: 50,
                data: [usage],
                backgroundColor:
                    usage < quota
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
            },
        ],
    };
};

export default function CPUConsumption(props) {
    const { isLoading, subscription, data, errors } = props;
    const quota = getUserQuota(constants.CPU_HOURS_RESOURCE_NAME, subscription);
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    let errorFound;

    if (errors && errors.length > 0) {
        errorFound = errors.find((error) => error.field === "cpu_usage");
    }

    if (errorFound) {
        if (getErrorCode(errorFound) === 404) {
            return (
                <Typography
                    variant="caption"
                    style={{ padding: theme.spacing(1) }}
                >
                    {t("noCPUConsumptionInfo")}
                </Typography>
            );
        } else {
            return (
                <div style={{ padding: theme.spacing(1) }}>
                    <ErrorTypographyWithDialog
                        errorObject={errorFound}
                        errorMessage={t("cpuConsumptionError")}
                    />
                </div>
            );
        }
    }
    if (isLoading) {
        return <Skeleton variant="rect" width={300} height={200} />;
    }

    const usage = Number.parseFloat(data?.total).toFixed(2);
    return (
        <>
            <Bar
                options={options(
                    usage,
                    quota,
                    formatDateObject(new Date(data?.last_modified)),
                    t("cpuConsumption"),
                    theme,
                    t
                )}
                data={getFormattedData(usage, quota, theme)}
            />
        </>
    );
}
