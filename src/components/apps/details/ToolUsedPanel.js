/**
 * @author sriram
 *
 */
import React from "react";
import intlData from "../messages";
import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import GridLabelValue from "../../utils/GridLabelValue";
import GridLoading from "../../utils/GridLoading";
import ids from "../ids";

function ToolsUsedPanel({ details, loading, baseId, error }) {
    if (loading) {
        return <GridLoading baseId={baseId} rows={10} />;
    }
    if (error) {
        return <span>{error}</span>;
    }
    if (details) {
        const toolUsedBaseId = build(baseId, details.id, ids.TOOLS_USED);
        return details.tools.map((toolInfo, index) => (
            <Accordion
                key={index}
                id={build(toolUsedBaseId, index, toolInfo.name)}
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
                            {getMessage("details")}
                        </Grid>
                        <GridLabelValue label={getMessage("toolNameLabel")}>
                            {toolInfo.name}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("descriptionLabel")}>
                            {toolInfo.description}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("imageLabel")}>
                            {toolInfo.image}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("toolVersionLabel")}>
                            {toolInfo.version}
                        </GridLabelValue>
                        <GridLabelValue
                            label={getMessage("toolAttributionLabel")}
                        >
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

export default withI18N(ToolsUsedPanel, intlData);
