/**
 *
 * A chart that displays the GPU consumption of the user.
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
import { Typography, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
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
    const formatValue = (value) => `${value} ${t("gpuHours")}`;

    // When quota is 0 (unlimited), skip quota-based tick logic to avoid
    // division-by-zero and use usage-based scaling instead.
    let xMax;
    let scaleOptions = {};
    if (quota === 0) {
        const usageNum = Number.parseFloat(usage) || 0;
        xMax = Math.max(Math.ceil(usageNum * 1.25), 1);
    } else {
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
        xMax = Math.max(Math.ceil(usage / stepSize) * stepSize, quota);
        scaleOptions = {
            ticks: {
                stepSize: stepSize,
                callback: function (value, index, values) {
                    if (quota !== 0 && value === quota) {
                        return t("quotaLimit", {
                            limit: formatValue(value),
                        });
                    } else {
                        return formatValue(value);
                    }
                },
            },
        };
    }

    const secondaryTitle =
        quota === 0
            ? t("consumptionChartNoQuotaTitle", { timestamp })
            : t("consumptionChartSecondaryTitle", {
                  percentage: formatUsagePercentage(usage, quota),
                  timestamp,
              });

    return {
        indexAxis: "y",
        plugins: {
            title: {
                display: true,
                text: [title, secondaryTitle],
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
                display: () =>
                    quota === 0 ? true : (100 * usage) / quota > 20,
                backgroundColor: function (context) {
                    return context.dataset.backgroundColor;
                },
                borderRadius: 4,
                color: theme.palette.primary.contrastText,
                font: {
                    weight: "bold",
                },
                formatter: (value) =>
                    quota === 0
                        ? `${t("gpuHoursUsedNoQuota", { value })}`
                        : `${t("gpuHoursUsed", { value, quota })}`,
                padding: 1,
            },
        },
        responsive: false,
        scales: {
            x: {
                barThickness: "flex",
                stacked: false,
                min: 0,
                max: xMax,
                ...scaleOptions,
            },
        },
    };
};

const labels = [""];

const getFormattedData = (usage, quota, theme, t) => {
    return {
        labels,
        datasets: [
            {
                label:
                    quota === 0
                        ? t("gpuHoursUsedNoQuota", { value: usage })
                        : t("gpuHoursUsed", { value: usage, quota }),
                barThickness: 50,
                data: [usage],
                backgroundColor:
                    !quota || usage < quota
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
            },
        ],
    };
};

export default function GPUConsumption(props) {
    const { isLoading, subscription, data, errors } = props;
    const quota = getUserQuota(constants.GPU_HOURS_RESOURCE_NAME, subscription);
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    let errorFound;

    if (errors && errors.length > 0) {
        errorFound = errors.find((error) => error.field === "gpu_usage");
    }

    if (errorFound) {
        if (getErrorCode(errorFound) === 404) {
            return (
                <Typography
                    variant="caption"
                    style={{ padding: theme.spacing(1) }}
                >
                    {t("noGPUConsumptionInfo")}
                </Typography>
            );
        } else {
            return (
                <div style={{ padding: theme.spacing(1) }}>
                    <ErrorTypographyWithDialog
                        errorObject={errorFound}
                        errorMessage={t("gpuConsumptionError")}
                    />
                </div>
            );
        }
    }
    if (isLoading) {
        return <Skeleton variant="rectangular" width={300} height={200} />;
    }

    // Don't render the chart when the user has no GPU quota and no usage.
    // Users with a quota but zero usage should still see the card so they
    // can see their remaining balance.
    const usage = Number.parseFloat(data?.total || 0).toFixed(2);
    if (!quota && Number.parseFloat(usage) === 0) {
        return null;
    }

    return (
        <Bar
            options={options(
                usage,
                quota,
                formatDateObject(new Date(data?.last_modified)),
                t("gpuConsumption"),
                theme,
                t
            )}
            data={getFormattedData(usage, quota, theme, t)}
        />
    );
}
