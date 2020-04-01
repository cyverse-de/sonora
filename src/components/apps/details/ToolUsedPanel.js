/**
 * @author sriram
 *
 */
import React from "react";
import intlData from "../messages";
import { build, getMessage, Highlighter, withI18N } from "@cyverse-de/ui-lib";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import GridLabelValue from "../../utils/GridLabelValue";
import GridLoading from "../../utils/GridLoading";

function ToolsUsedPanel({ details, loading, baseId, searchText }) {
    if (loading) {
        return <GridLoading rows={10} />;
    }
    if (details) {
        return details.tools.map((toolInfo, index) => (
            <ExpansionPanel
                key={index}
                id={build(baseId, index, toolInfo.name)}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="caption">
                        <Highlighter search={searchText}>
                            {toolInfo.name}
                        </Highlighter>
                        :
                        <Highlighter search={searchText}>
                            {toolInfo.description}
                        </Highlighter>
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
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
                </ExpansionPanelDetails>
            </ExpansionPanel>
        ));
    } else {
        return null;
    }
}

export default withI18N(ToolsUsedPanel, intlData);
