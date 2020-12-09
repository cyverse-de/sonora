import React, { useState } from "react";

import { useTranslation } from "i18n";

import GridLabelValue from "components/utils/GridLabelValue";
import GridLoading from "components/utils/GridLoading";
import ErrorTypography from "components/utils/error/ErrorTypography";
import DEErrorDialog from "components/utils/error/DEErrorDialog";

import { Grid, Paper, Typography } from "@material-ui/core";

const NOT_APPLICABLE = "N/A";

export default function ToolDetails(props) {
    const { baseDebugId, tool, isInfoFetching, infoFetchError } = props;
    const { t } = useTranslation("tools");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    if (isInfoFetching) {
        return <GridLoading rows={2} baseId={baseDebugId} />;
    }

    if (!tool && !isInfoFetching && !infoFetchError) {
        return null;
    }

    if (infoFetchError) {
        return (
            <>
                <ErrorTypography
                    errorMessage={t("analysisInfoFetchError")}
                    onDetailsClick={() => setErrorDialogOpen(true)}
                />
                <DEErrorDialog
                    open={errorDialogOpen}
                    baseId={baseDebugId}
                    errorObject={infoFetchError}
                    handleClose={() => {
                        setErrorDialogOpen(false);
                    }}
                />
            </>
        );
    }

    return (
        <Paper id={baseDebugId} style={{ padding: 5 }}>
            <Grid container spacing={2}>
                <GridLabelValue label={t("toolAttributionLabel")}>
                    {tool.attribution}
                </GridLabelValue>
                <GridLabelValue label={t("descriptionLabel")}>
                    {tool.description}
                </GridLabelValue>
                <GridLabelValue label={t("imageNameLbl")}>
                    {tool.container.image.name}
                </GridLabelValue>
                <GridLabelValue label={t("imageTagLbl")}>
                    {tool.container.image.tag}
                </GridLabelValue>
                <GridLabelValue label={t("imageUrlLbl")}>
                    {tool.container.image.url}
                </GridLabelValue>
                <GridLabelValue label={t("deprecatedLbl")}>
                    {tool.container.image.deprecated ? "true" : "false"}
                </GridLabelValue>
                <GridLabelValue label={t("entryPointLbl")}>
                    {tool.container.entrypoint}
                </GridLabelValue>
                <GridLabelValue label={t("uidLbl")}>
                    {tool.container.uid}
                </GridLabelValue>
                <GridLabelValue label={t("workingDirLbl")}>
                    {tool.container.working_directory}
                </GridLabelValue>
                <GridLabelValue label={t("versionLbl")}>
                    {tool.version}
                </GridLabelValue>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("resourceRequirementsLbl")}
                    </Typography>
                </Grid>
                <GridLabelValue label={t("minCPUCoresLbl")}>
                    {tool.container.min_cpu_cores}
                </GridLabelValue>
                <GridLabelValue label={t("maxCPUCoresLbl")}>
                    {tool.container.max_cpu_cores}
                </GridLabelValue>
                <GridLabelValue label={t("minMemoryLimitLbl")}>
                    {tool.container.min_memory_limit}
                </GridLabelValue>
                <GridLabelValue label={t("minDiskSpaceLbl")}>
                    {tool.container.min_disk_space}
                </GridLabelValue>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("restrictionsLabel")}
                    </Typography>
                </Grid>
                <GridLabelValue label={t("memoryLimitLabel")}>
                    {tool.container.memory_limit
                        ? tool.container.memory_limit
                        : NOT_APPLICABLE}
                </GridLabelValue>
                <GridLabelValue label={t("pidsLimitLabel")}>
                    {tool.container.pids_limit
                        ? tool.container.pids_limit
                        : NOT_APPLICABLE}
                </GridLabelValue>
                <GridLabelValue label={t("networkingLabel")}>
                    {tool.container.network_mode
                        ? tool.container.network_mode
                        : t("enabled")}
                </GridLabelValue>
                <GridLabelValue label={t("secondsLimitLabel")}>
                    {tool.time_limit_seconds
                        ? tool.time_limit_seconds
                        : NOT_APPLICABLE}
                </GridLabelValue>
            </Grid>
        </Paper>
    );
}
