/**
 *
 * @author sriram
 *
 * A Dashboard item to display various resource usage metrics
 *
 */

import React from "react";
import { Trans, useTranslation } from "i18n";
import {
    Button,
    Grid,
    Typography,
    Divider,
    useTheme,
    Card,
} from "@material-ui/core";

import DataConsumption from "./DataConsumption";
import AnalysesStats from "./AnalysesStats";
import CPUConsumption from "./CPUConsumption";
import ExternalLink from "components/utils/ExternalLink";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { formatDateObject } from "components/utils/DateFormatter";

import { FEATURE_MATRIX_URL } from "../constants";
import { useConfig } from "contexts/config";

import { Skeleton } from "@material-ui/lab";

export default function ResourceUsageItem(props) {
    const { resourceUsageSummary, resourceUsageError, isLoading } = props;
    const { t } = useTranslation(["dashboard", "common"]);

    const [config] = useConfig();
    const theme = useTheme();
    if (isLoading) {
        return <Skeleton variant="rect" width={800} height={200} />;
    }

    const subscription = resourceUsageSummary?.subscription;
    const startDate = formatDateObject(
        new Date(subscription?.effective_start_date)
    );
    const endDate = formatDateObject(
        new Date(subscription?.effective_end_date)
    );
    const currentPlanName = subscription?.plan?.name;
    const dataUsage = resourceUsageSummary?.data_usage;
    const cpuUsage = resourceUsageSummary?.cpu_usage;
    const usageSummaryErrors = resourceUsageSummary?.errors;

    return (
        <>
            <Typography
                variant="h6"
                style={{
                    color: theme.palette.info.main,
                    margin: theme.spacing(1),
                }}
            >
                {t("resourceUsage")}
            </Typography>
            <Divider
                style={{
                    marginBottom: theme.spacing(1),
                    color: theme.palette.info.main,
                }}
            />
            {resourceUsageError && (
                <ErrorTypographyWithDialog
                    errorMessage={t("common:usageSummaryError")}
                    errorObject={resourceUsageError}
                />
            )}
            {!resourceUsageError && (
                <>
                    {resourceUsageSummary && (
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography>
                                    <Trans
                                        t={t}
                                        values={{ plan: currentPlanName }}
                                        i18nKey="currentPlan"
                                        components={{
                                            featureMatrixLink: (
                                                <ExternalLink
                                                    href={FEATURE_MATRIX_URL}
                                                />
                                            ),
                                        }}
                                    />
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                        window.open(
                                            config?.subscriptions?.checkout_url,
                                            "_blank"
                                        )
                                    }
                                >
                                    {t("buy")}
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    {t("effectiveTimePeriod", {
                                        startDate,
                                        endDate,
                                    })}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                    <Grid container spacing={2}>
                        {resourceUsageSummary && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <DataConsumption
                                        data={dataUsage}
                                        subscription={subscription}
                                        isLoading={isLoading}
                                        errors={usageSummaryErrors}
                                    />
                                </Card>
                            </Grid>
                        )}

                        {resourceUsageSummary && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CPUConsumption
                                        data={cpuUsage}
                                        subscription={subscription}
                                        isLoading={isLoading}
                                        errors={usageSummaryErrors}
                                    />
                                </Card>
                            </Grid>
                        )}
                        <Grid item xs={12} md={12}>
                            <Card>
                                <AnalysesStats />
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
