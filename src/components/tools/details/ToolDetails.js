import React from "react";

import { useTranslation } from "i18n";

import GridLabelValue from "components/utils/GridLabelValue";
import GridLoading from "components/utils/GridLoading";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import { Grid, Typography } from "@mui/material";

export default function ToolDetails(props) {
    const { baseDebugId, tool, isInfoFetching, infoFetchError } = props;
    const { t } = useTranslation("tools");

    if (isInfoFetching) {
        return <GridLoading rows={10} baseId={baseDebugId} />;
    }

    if (infoFetchError) {
        return (
            <ErrorTypographyWithDialog
                errorObject={infoFetchError}
                errorMessage={t("toolInfoError")}
            />
        );
    }

    if (!tool && !isInfoFetching && !infoFetchError) {
        return null;
    }

    return (
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
                <Typography variant="h6">
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
                <Typography variant="h6">{t("restrictionsLabel")}</Typography>
            </Grid>
            <GridLabelValue label={t("memoryLimitLabel")}>
                {tool.container.memory_limit
                    ? tool.container.memory_limit
                    : t("notApplicable")}
            </GridLabelValue>
            <GridLabelValue label={t("pidsLimitLabel")}>
                {tool.container.pids_limit
                    ? tool.container.pids_limit
                    : t("notApplicable")}
            </GridLabelValue>
            <GridLabelValue label={t("networkingLabel")}>
                {tool.container.network_mode
                    ? tool.container.network_mode
                    : t("enabled")}
            </GridLabelValue>
            <GridLabelValue label={t("secondsLimitLabel")}>
                {tool.time_limit_seconds
                    ? tool.time_limit_seconds
                    : t("notApplicable")}
            </GridLabelValue>
        </Grid>
    );
}
