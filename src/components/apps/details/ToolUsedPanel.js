/**
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import GridLabelValue from "components/utils/GridLabelValue";
import GridLoading from "components/utils/GridLoading";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import ids from "../ids";

function ToolsUsedPanel({ details, loading, baseId, error }) {
    const { t } = useTranslation("apps");
    if (loading) {
        return <GridLoading baseId={baseId} rows={10} />;
    }
    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorObject={error}
                errorMessage={t("toolUsedError")}
            />
        );
    }
    if (details) {
        const toolUsedBaseId = buildID(baseId, details.id, ids.TOOLS_USED);
        return details.tools.map((toolInfo, index) => (
            <Accordion
                key={index}
                id={buildID(toolUsedBaseId, index, toolInfo.name)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon color="primary" />}
                >
                    <Typography variant="caption">
                        {toolInfo.name}:{toolInfo.description}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {t("details")}
                        </Grid>
                        <GridLabelValue label={t("toolNameLabel")}>
                            {toolInfo.name}
                        </GridLabelValue>
                        <GridLabelValue label={t("descriptionLabel")}>
                            {toolInfo.description}
                        </GridLabelValue>
                        <GridLabelValue label={t("imageLabel")}>
                            {toolInfo?.container?.image?.name}
                        </GridLabelValue>
                        <GridLabelValue label={t("toolVersionLabel")}>
                            {toolInfo.version}
                        </GridLabelValue>
                        <GridLabelValue label={t("toolAttributionLabel")}>
                            {toolInfo.attribution}
                        </GridLabelValue>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        ));
    } else {
        return null;
    }
}

export default ToolsUsedPanel;
