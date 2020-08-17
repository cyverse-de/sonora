/**
 *
 * A component that displays detailed search results.
 *
 * @author sriram
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Tab from "@material-ui/core/Tab";
import AppSearchResults from "./AppSearchResults";
import DataSearchResults from "./DataSearchResults";
import AnalysesSearchResults from "./AnalysesSearchResults";

import DETabPanel from "components/utils/DETabPanel";

import { useMediaQuery, useTheme, Tabs } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 0,
        padding: 0,
    },
    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
    },

    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
}));

const TABS = {
    data: "DATA",
    apps: "APPS",
    analyses: "ANALYSES",
};

export default function DetailedSearchResults(props) {
    const { baseId, searchTerm } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [selectedTab, setSelectedTab] = useState(TABS.data);
    const { t } = useTranslation(["common", "search"]);
    const [appsCount, setAppsCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [analysesCount, setAnalysesCount] = useState(0);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };
    const dataTabId = build(baseId, ids.DATA_SEARCH_RESULTS_TAB);
    const appsTabId = build(baseId, ids.APPS_SEARCH_RESULTS_TAB);
    const analysesTabId = build(baseId, ids.ANALYSES_SEARCH_RESULTS_TAB);

    return (
        <Paper className={classes.root}>
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
                centered={!isMobile}
                variant={isMobile ? "fullWidth" : "standard"}
                style={{ padding: 4 }}
            >
                <Tab
                    value={TABS.data}
                    id={dataTabId}
                    label={t("dataSearchTab", { count: dataCount })}
                    classes={{ selected: classes.tabSelected }}
                />
                <Tab
                    value={TABS.apps}
                    id={appsTabId}
                    label={t("appsSearchTab", { count: appsCount })}
                    classes={{ selected: classes.tabSelected }}
                />
                <Tab
                    value={TABS.analyses}
                    id={analysesTabId}
                    label={t("analysesSearchTab", { count: analysesCount })}
                    classes={{ selected: classes.tabSelected }}
                />
            </Tabs>

            <DETabPanel
                tabId={dataTabId}
                value={TABS.data}
                selectedTab={selectedTab}
            >
                <DataSearchResults
                    searchTerm={searchTerm}
                    updateResultCount={(count) => setDataCount(count)}
                    baseId={dataTabId}
                />
            </DETabPanel>
            <DETabPanel
                tabId={appsTabId}
                value={TABS.apps}
                selectedTab={selectedTab}
            >
                <AppSearchResults
                    searchTerm={searchTerm}
                    updateResultCount={(count) => setAppsCount(count)}
                    baseId={appsTabId}
                />
            </DETabPanel>
            <DETabPanel
                tabId={analysesTabId}
                value={TABS.analyses}
                selectedTab={selectedTab}
            >
                <AnalysesSearchResults
                    searchTerm={searchTerm}
                    updateResultCount={(count) => setAnalysesCount(count)}
                    baseId={analysesTabId}
                />
            </DETabPanel>
        </Paper>
    );
}
