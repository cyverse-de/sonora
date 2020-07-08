/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as job history, params etc...
 *
 */

import React, { useState, useEffect } from "react";

import { useQuery } from "react-query";
import { injectIntl } from "react-intl";

import ArgumentTypes from "./ArgumentTypes";
import {
    parseStringValue,
    parseSelectionValue,
    isReferenceGenomeType,
    isInputType,
    isTextType,
    isSelectionArgumentType,
} from "./ArgumentTypeUtils";
import ids from "../../analyses/ids";
import messages from "../../analyses/messages";
import DETabPanel from "../../utils/DETabPanel";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";
import {
    getAnalysisHistory,
    getAnalysisParameters,
    ANALYSIS_HISTORY_QUERY_KEY,
    ANALYSIS_PARAMS_QUERY_KEY,
} from "../../../serviceFacades/analyses";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";

import { Drawer, Tab, Tabs, Typography } from "@material-ui/core";

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

    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
    headerOperations: {
        marginLeft: theme.spacing(1),
    },
}));

function DetailsDrawer(props) {
    const classes = useStyles();
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
                type === ArgumentTypes.PARAM_TYPE.FLAG ||
                type === ArgumentTypes.PARAM_TYPE.FILE_OUTPUT
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

    const drawerId = build(baseId, ids.DETAILS_DRAWER);
    const infoTabId = build(drawerId, ids.INFO_TAB);
    const paramsTabId = build(drawerId, ids.PARAMS_TAB);

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
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
            >
                <Tab
                    value={TABS.analysisInfo}
                    label={getMessage("info")}
                    id={infoTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(infoTabId, ids.PANEL)}
                />
                <Tab
                    value={TABS.analysisParams}
                    label={getMessage("analysisParams")}
                    id={paramsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(paramsTabId, ids.PANEL)}
                />
            </Tabs>
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
export default withI18N(injectIntl(DetailsDrawer), messages);
