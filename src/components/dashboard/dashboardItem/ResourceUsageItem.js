/**
 *
 * @author sriram
 *
 * A Dashboard item to display various resource usage metrics
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { useQuery } from "react-query";
import { Trans } from "react-i18next";
import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";
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
import { FEATURE_MATRIX_URL, CHECKOUT_URL } from "../constants";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { formatDateObject } from "components/utils/DateFormatter";
import { Skeleton } from "@material-ui/lab";

export default function ResourceUsageItem(props) {
    const { t } = useTranslation("dashboard");
    const { status, data, error } = useQuery([RESOURCE_USAGE_QUERY_KEY], () =>
        getResourceUsageSummary()
    );

    const theme = useTheme();
    if (status === "loading") {
        return <Skeleton variant="rect" width={800} height={200} />;
    }
    const startDate = formatDateObject(
        new Date(data?.user_plan.effective_start_date)
    );
    const endDate = formatDateObject(
        new Date(data?.user_plan.effective_end_date)
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
            {error && (
                <ErrorTypographyWithDialog
                    errorMessage={t("usageSummaryError")}
                    errorObject={error}
                />
            )}
            {!error && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography>
                                <Trans
                                    t={t}
                                    values={{
                                        plan: data?.user_plan?.plan?.name,
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
                                    window.open(CHECKOUT_URL, "_blank")
                                }
                            >
                                Buy
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
                                    data={data?.data_usage}
                                    status={status}
                                    errors={data?.errors}
                                />
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CPUConsumption
                                    data={data?.cpu_usage}
                                    status={status}
                                    errors={data?.errors}
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
