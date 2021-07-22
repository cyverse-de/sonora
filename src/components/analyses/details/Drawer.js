/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as job history, params etc...
 *
 */

import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import {
    isInputType,
    isReferenceGenomeType,
    isSelectionArgumentType,
    isTextType,
    parseSelectionValue,
    parseStringValue,
} from "./ArgumentTypeUtils";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";

import ids from "../ids";

import AppParamTypes from "components/models/AppParamTypes";
import { DETab, DETabPanel, DETabs } from "components/utils/DETabs";

import {
    ANALYSIS_HISTORY_QUERY_KEY,
    ANALYSIS_PARAMS_QUERY_KEY,
    getAnalysisHistory,
    getAnalysisParameters,
} from "serviceFacades/analyses";

import buildID from "components/utils/DebugIDUtil";

import { Drawer, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const TABS = {
    analysisInfo: "ANALYSIS INFORMATION",
    analysisParams: "ANALYSIS PARAMETERS",
};

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "90%",
        },
    },

    drawerHeader: {
        margin: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
    drawerSubHeader: {
        marginLeft: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },

    headerOperations: {
        marginLeft: theme.spacing(1),
    },
}));

function DetailsDrawer(props) {
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    const { selectedAnalysis, open, onClose, baseId } = props;
    const [selectedTab, setSelectedTab] = useState(TABS.analysisInfo);
    const [history, setHistory] = useState(null);
    const [parameters, setParameters] = useState(null);

    const [infoKey, setInfoKey] = useState(ANALYSIS_HISTORY_QUERY_KEY);
    const [paramKey, setParamKey] = useState(ANALYSIS_PARAMS_QUERY_KEY);
    const [infoKeyQueryEnabled, setInfoKeyQueryEnabled] = useState(false);
    const [paramKeyQueryEnabled, setParamKeyQueryEnabled] = useState(false);

    const preProcessData = (data) => {
        if (!data || !data.parameters) {
            return;
        }
        if (data.parameters.length === 0) {
            setParameters([]);
            return;
        }
        let paramList = [];
        data.parameters.forEach((parameter) => {
            const type = parameter.param_type;
            let parsedParam = null;
            if (
                isTextType(type) ||
                isInputType(type) ||
                type === AppParamTypes.FLAG ||
                type === AppParamTypes.FILE_OUTPUT
            ) {
                parsedParam = parseStringValue(parameter);
            } else if (
                isSelectionArgumentType(type) ||
                isReferenceGenomeType(type)
            ) {
                parsedParam = parseSelectionValue(parameter);
            }

            if (parsedParam) {
                paramList.push(parsedParam);
            }
        });
        setParameters(paramList);
    };

    const { isFetching: isInfoFetching, error: infoFetchError } = useQuery({
        queryKey: infoKey,
        queryFn: getAnalysisHistory,
        config: {
            enabled: infoKeyQueryEnabled,
            onSuccess: setHistory,
        },
    });

    const { isFetching: isParamsFetching, error: paramsFetchError } = useQuery({
        queryKey: paramKey,
        queryFn: getAnalysisParameters,
        config: {
            enabled: paramKeyQueryEnabled,
            onSuccess: preProcessData,
        },
    });

    useEffect(() => {
        if (selectedAnalysis) {
            setInfoKey([
                ANALYSIS_HISTORY_QUERY_KEY,
                { id: selectedAnalysis.id },
            ]);
            setParamKey([
                "ANALYSIS_PARAMS_QUERY_KEY",
                { id: selectedAnalysis.id },
            ]);
            setInfoKeyQueryEnabled(true);
            setParamKeyQueryEnabled(true);
        } else {
            setInfoKeyQueryEnabled(false);
            setParamKeyQueryEnabled(false);
        }
    }, [selectedAnalysis]);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    if (!selectedAnalysis) {
        return null;
    }

    const analysisName = selectedAnalysis.name;

    const drawerId = buildID(baseId, ids.DETAILS_DRAWER);
    const infoTabId = buildID(drawerId, ids.INFO_TAB);
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
            <div className={classes.drawerHeader}>
                <Typography variant="h6">{analysisName}</Typography>
            </div>
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.analysisInfo}
                    label={t("info")}
                    id={infoTabId}
                    aria-controls={buildID(infoTabId, ids.PANEL)}
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
                <InfoPanel
                    info={history}
                    isInfoFetching={isInfoFetching}
                    infoFetchError={infoFetchError}
                    baseId={infoTabId}
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
