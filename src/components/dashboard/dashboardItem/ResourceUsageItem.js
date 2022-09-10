/**
 *
 * @author sriram
 *
 * A Dashboard item to display various resource usage metrics
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
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
    const { t } = useTranslation("dashboard");

    const [config] = useConfig();
    const theme = useTheme();
    if (isLoading) {
        return <Skeleton variant="rect" width={800} height={200} />;
    }
    const startDate = formatDateObject(
        new Date(resourceUsageSummary?.user_plan.effective_start_date)
    );
    const endDate = formatDateObject(
        new Date(resourceUsageSummary?.user_plan.effective_end_date)
    );
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
                    errorMessage={t("usageSummaryError")}
                    errorObject={resourceUsageError}
                />
            )}
            {!resourceUsageError && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography>
                                <Trans
                                    t={t}
                                    values={{
                                        plan: resourceUsageSummary?.user_plan
                                            ?.plan?.name,
                                    }}
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <DataConsumption
                                    data={resourceUsageSummary?.data_usage}
                                    userPlan={resourceUsageSummary?.user_plan}
                                    isLoading={isLoading}
                                    errors={resourceUsageSummary?.errors}
                                />
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CPUConsumption
                                    data={resourceUsageSummary?.cpu_usage}
                                    userPlan={resourceUsageSummary?.user_plan}
                                    isLoading={isLoading}
                                    errors={resourceUsageSummary?.errors}
                                />
                            </Card>
                        </Grid>
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
