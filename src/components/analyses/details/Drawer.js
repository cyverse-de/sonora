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
import ids from "../../analyses/ids";
import messages from "../../analyses/messages";
import DETabPanel from "../../utils/DETabPanel";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";
import {
    getAnalysisHistory,
    getAnalysisParameters,
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
    const [infoKey, setInfoKey] = useState("");
    const [paramKey, setParamKey] = useState("");

    const preProcessData = (data) => {
        const isSelectionArgumentType = (type) => {
            return (
                isSimpleSelectionArgumentType(type) ||
                type === ArgumentTypes.PARAM_TYPE.TREE_SELECTION
            );
        };

        const isSimpleSelectionArgumentType = (type) => {
            return (
                type === ArgumentTypes.PARAM_TYPE.TEXT_SELECTION ||
                type === ArgumentTypes.PARAM_TYPE.INTEGER_SELECTION ||
                type === ArgumentTypes.PARAM_TYPE.DOUBLE_SELECTION ||
                type === ArgumentTypes.PARAM_TYPE.SELECTION ||
                type === ArgumentTypes.PARAM_TYPE.VALUE_SELECTION
            );
        };

        const isTextType = (type) => {
            return (
                type === ArgumentTypes.PARAM_TYPE.TEXT ||
                type === ArgumentTypes.PARAM_TYPE.MULTILINE_TEXT ||
                type === ArgumentTypes.PARAM_TYPE.ENV_VAR ||
                type === ArgumentTypes.PARAM_TYPE.OUTPUT ||
                type === ArgumentTypes.PARAM_TYPE.NUMBER ||
                type === ArgumentTypes.PARAM_TYPE.INTEGER ||
                type === ArgumentTypes.PARAM_TYPE.DOUBLE
            );
        };

        const INPUT_TYPES = [
            ArgumentTypes.PARAM_TYPE.INPUT,
            ArgumentTypes.PARAM_TYPE.FILE_INPUT,
            ArgumentTypes.PARAM_TYPE.FOLDER_INPUT,
            ArgumentTypes.PARAM_TYPE.MULTIFILE_SELECTOR,
            ArgumentTypes.PARAM_TYPE.FILE_FOLDER_INPUT,
        ];

        const REFERENCE_GENOME_TYPES = [
            "referenceannotation",
            "referencesequence",
            "referencegenome",
        ];

        const isInputType = (type) => {
            return INPUT_TYPES.includes(type);
        };

        const isReferenceGenomeType = (type) => {
            return REFERENCE_GENOME_TYPES.includes(type);
        };

        const parseSelectionValue = (ap) => {
            const val = ap.param_value.value;
            if (!val) {
                return [];
            }
            ap.displayValue = val.display;
            return ap;
        };

        const parseStringValue = (ap) => {
            const val = ap.param_value.value;
            ap.displayValue = val;
            return ap;
        };

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
            if (isTextType(type) || type === ArgumentTypes.PARAM_TYPE.FLAG) {
                paramList.push(parseStringValue(parameter));
            } else if (isInputType(type) || isReferenceGenomeType(type)) {
                if (!isReferenceGenomeType(type)) {
                    paramList.push(parseStringValue(parameter));
                } else {
                    paramList.push(parseSelectionValue(parameter));
                }
            } else if (isSelectionArgumentType(type)) {
                paramList.push(parseSelectionValue(parameter));
            } else if (type === ArgumentTypes.PARAM_TYPE.FILE_OUTPUT) {
                paramList.push(parseStringValue(parameter));
            }
        });
        setParameters(paramList);
    };

    const { isFetching: isInfoFetching, error: infoFetchError } = useQuery({
        queryKey: infoKey,
        queryFn: getAnalysisHistory,
        config: {
            onSuccess: setHistory,
        },
    });

    const { isFetching: isParamsFetching, error: paramsFetchError } = useQuery({
        queryKey: paramKey,
        queryFn: getAnalysisParameters,
        config: {
            onSuccess: preProcessData,
        },
    });

    useEffect(() => {
        if (selectedAnalysis) {
            setInfoKey(["analysisInfoKey", { id: selectedAnalysis.id }]);
            setParamKey(["analysisParamsKey", { id: selectedAnalysis.id }]);
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
                <Typography>{analysisName}</Typography>
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
