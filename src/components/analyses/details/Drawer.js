/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as job history, params etc...
 *
 */

import React, { useState } from "react";

import { useTranslation } from "i18n";

import DetailsPanel from "./DetailsPanel";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";
import ids from "../ids";
import { DETab, DETabPanel, DETabs } from "components/utils/DETabs";

import {
    useAnalysisInfo,
    useAnalysisParameters,
} from "serviceFacades/analyses";

import buildID from "components/utils/DebugIDUtil";

import { Drawer, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const TABS = {
    analysisInfo: "ANALYSIS INFORMATION",
    analysisHistory: "ANALYSIS STATUS HISTORY",
    analysisParams: "ANALYSIS PARAMETERS",
};

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("xl")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("md")]: {
            maxWidth: "90%",
        },
    },

    drawerHeader: {
        margin: theme.spacing(1),
        overflowWrap: "break-word",
    },
}));

function DetailsDrawer(props) {
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    const { selectedAnalysis, open, onClose, baseId } = props;
    const [selectedTab, setSelectedTab] = useState(TABS.analysisInfo);
    const [history, setHistory] = useState(null);
    const [parameters, setParameters] = useState(null);

    const { isFetching: isInfoFetching, error: infoFetchError } =
        useAnalysisInfo({
            id: selectedAnalysis?.id,
            enabled: !!selectedAnalysis?.id,
            onSuccess: setHistory,
        });

    const { isFetching: isParamsFetching, error: paramsFetchError } =
        useAnalysisParameters({
            id: selectedAnalysis?.id,
            enabled: !!selectedAnalysis?.id,
            onSuccess: setParameters,
        });

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    if (!selectedAnalysis) {
        return null;
    }

    const analysisName = selectedAnalysis.name;

    const drawerId = buildID(baseId, ids.DETAILS_DRAWER);
    const infoTabId = buildID(drawerId, ids.INFO_TAB);
    const historyTabId = buildID(drawerId, ids.INFO_TAB);
    const paramsTabId = buildID(drawerId, ids.PARAMS_TAB);

    return (
        <Drawer
            onClose={onClose}
            open={open}
            anchor="right"
            PaperProps={{
                id: drawerId,
                classes: { root: classes.drawerPaper },
                variant: "outlined",
            }}
        >
            <Typography variant="h6" className={classes.drawerHeader}>
                {analysisName}
            </Typography>
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.analysisInfo}
                    label={t("info")}
                    id={infoTabId}
                    aria-controls={buildID(infoTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.analysisHistory}
                    label={t("statusHistory")}
                    id={historyTabId}
                    aria-controls={buildID(historyTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.analysisParams}
                    label={t("analysisParams")}
                    id={paramsTabId}
                    aria-controls={buildID(paramsTabId, ids.PANEL)}
                />
            </DETabs>
            <DETabPanel
                tabId={infoTabId}
                value={TABS.analysisInfo}
                selectedTab={selectedTab}
            >
                <DetailsPanel baseId={baseId} analysis={selectedAnalysis} />
            </DETabPanel>
            <DETabPanel
                tabId={historyTabId}
                value={TABS.analysisHistory}
                selectedTab={selectedTab}
            >
                <InfoPanel
                    info={history}
                    isInfoFetching={isInfoFetching}
                    infoFetchError={infoFetchError}
                    baseId={historyTabId}
                />
            </DETabPanel>
            <DETabPanel
                tabId={paramsTabId}
                value={TABS.analysisParams}
                selectedTab={selectedTab}
            >
                <ParamsPanel
                    parameters={parameters}
                    isParamsFetching={isParamsFetching}
                    paramsFetchError={paramsFetchError}
                    baseId={paramsTabId}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default DetailsDrawer;
