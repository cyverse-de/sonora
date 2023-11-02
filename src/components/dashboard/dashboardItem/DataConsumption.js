/**
 *
 * @author sriram
 *
 * A chart that displays the data consumption of the user.
 *
 */

import React from "react";
import { Trans, useTranslation } from "i18n";
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
import { formatFileSize } from "components/data/utils";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { getErrorCode } from "components/error/errorCode";
import { Typography, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
import { getUnixTime, parseISO } from "date-fns";
import {
    getFormattedDistance,
    formatDateObject,
} from "components/utils/DateFormatter";
import { formatUsagePercentage } from "components/subscriptions/utils";
import ExternalLink from "components/utils/ExternalLink";

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

const options = (usage, quota, date, distance, title, theme, t) => {
    let quotaGiB = quota / constants.ONE_GiB;
    let divisor =
        quotaGiB % 4 === 0
            ? 4
            : quotaGiB % 3 === 0
            ? 3
            : quotaGiB % 5 === 0
            ? 5
            : quotaGiB % 2 === 0
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
                        timestamp: date,
                    }),
                ],
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => context.dataset.label || "",
                    footer: function (context) {
                        return t("dataConsumptionTimestamp", { distance });
                    },
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
                formatter: (value) =>
                    `${formatFileSize(value)} of ${formatFileSize(quota)} used`,
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
                    usage < quota
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
            },
        ],
    };
};

export default function DataConsumption(props) {
    const { isLoading, subscription, data, errors } = props;
    const quota = getUserQuota(
        constants.DATA_STORAGE_RESOURCE_NAME,
        subscription
    );
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    let errorFound;

    if (errors && errors.length > 0) {
        errorFound = errors.find((error) => error.field === "data_usage");
    }

    if (errorFound) {
        if (getErrorCode(errorFound) === 404) {
            return (
                <Typography
                    variant="caption"
                    style={{ padding: theme.spacing(1) }}
                >
                    {t("noDataConsumptionInfo")}
                </Typography>
            );
        } else {
            return (
                <div style={{ padding: theme.spacing(1) }}>
                    <ErrorTypographyWithDialog
                        errorObject={errorFound}
                        errorMessage={t("dataConsumptionError")}
                    />
                </div>
            );
        }
    }
    if (isLoading) {
        return <Skeleton variant="rectangular" width={300} height={200} />;
    }
    const isoTime = parseISO(data?.time);
    const unixTime = getUnixTime(isoTime);
    const distance = getFormattedDistance(unixTime);
    const dateObj = new Date(isoTime);

    return (
        <>
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
            {data?.total > quota && (
                <div style={{ margin: theme.spacing(0.5) }}>
                    <Typography variant="caption">
                        <Trans
                            t={t}
                            i18nKey="dataOverageNote"
                            components={{
                                dataStoreFormLink: (
                                    <ExternalLink
                                        href={
                                            constants.DATA_STORE_INCREASE_FORM
                                        }
                                    />
                                ),
                            }}
                        />
                    </Typography>
                </div>
            )}
        </>
    );
}
