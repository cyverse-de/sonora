/**
 *
 * @author sriram
 *
 * A Dashboard item to display various resource usage metrics
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Grid, Typography, Divider, useTheme, Card } from "@material-ui/core";
import DataConsumption from "./DataConsumption";
import AnalysesStats from "./AnalysesStats";

export default function ResourceUsageItem(props) {
    const { t } = useTranslation("dashboard");
    const theme = useTheme();
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

            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <DataConsumption />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <AnalysesStats />
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
