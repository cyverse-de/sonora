/**
 *
 * A component that displays detailed search results.
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import AnimatedNumber from "animated-number-react";

import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import AppSearchResults from "./AppSearchResults";
import DataSearchResults from "./DataSearchResults";
import AnalysesSearchResults from "./AnalysesSearchResults";
import searchConstants from "../constants";

import DETabPanel from "components/utils/DETabPanel";

import {
    Divider,
    Paper,
    makeStyles,
    useMediaQuery,
    useTheme,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 0,
        padding: 0,
    },
    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
    },
    tabRoot: {
        padding: theme.spacing(0.25),
        margin: 0,
        height: 72,
        [theme.breakpoints.down("xs")]: {
            height: 68,
        },
    },
    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
    tabIcon: {
        height: 24,
        width: 24,
        [theme.breakpoints.down("xs")]: {
            height: 18,
            width: 18,
        },
    },
    searchInfo: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.25),
    },
}));

const TABS = {
    data: "DATA",
    apps: "APPS",
    analyses: "ANALYSES",
};

export default function DetailedSearchResults(props) {
    const { baseId, searchTerm, filter } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [selectedTab, setSelectedTab] = useState(TABS.data);
    const { t } = useTranslation("common");
    const { t: i18Search } = useTranslation("search");
    const [appsCount, setAppsCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [analysesCount, setAnalysesCount] = useState(0);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };
    const dataTabId = build(baseId, ids.DATA_SEARCH_RESULTS_TAB);
    const appsTabId = build(baseId, ids.APPS_SEARCH_RESULTS_TAB);
    const analysesTabId = build(baseId, ids.ANALYSES_SEARCH_RESULTS_TAB);

    useEffect(() => {
        if (filter === searchConstants.ALL || filter === searchConstants.DATA) {
            setSelectedTab(TABS.data);
        } else if (filter === searchConstants.APPS) {
            setSelectedTab(TABS.apps);
        } else if (filter === searchConstants.ANALYSES) {
            setSelectedTab(TABS.analyses);
        }
    }, [filter, setSelectedTab]);

    const dataTabIcon =
        selectedTab === TABS.data ? "/data_selected.png" : "/icon-data.png";
    const appsTabIcon =
        selectedTab === TABS.apps ? "/apps_selected.png" : "/icon-apps.png";
    const analysesTabIcon =
        selectedTab === TABS.analyses
            ? "/analyses_selected.png"
            : "/icon-analyses.png";

    const dataTab = (
        <Tab
            value={TABS.data}
            key={dataTabId}
            id={dataTabId}
            label={
                isMobile ? dataCount : t("dataSearchTab", { count: dataCount })
            }
            classes={{ selected: classes.tabSelected }}
            icon={
                <img
                    src={`${dataTabIcon}`}
                    alt={t("data")}
                    className={classes.tabIcon}
                />
            }
        />
    );

    const appsTab = (
        <Tab
            value={TABS.apps}
            key={appsTabId}
            id={appsTabId}
            label={
                isMobile ? appsCount : t("appsSearchTab", { count: appsCount })
            }
            classes={{ selected: classes.tabSelected }}
            icon={
                <img
                    src={`${appsTabIcon}`}
                    alt={t("apps")}
                    className={classes.tabIcon}
                />
            }
        />
    );

    const analysesTab = (
        <Tab
            value={TABS.analyses}
            key={analysesTabId}
            id={analysesTabId}
            label={
                isMobile
                    ? analysesCount
                    : t("analysesSearchTab", { count: analysesCount })
            }
            classes={{ selected: classes.tabSelected }}
            icon={
                <img
                    src={`${analysesTabIcon}`}
                    alt={t("analyses")}
                    className={classes.tabIcon}
                />
            }
        />
    );

    let tabsToRender = [dataTab, appsTab, analysesTab];
    if (filter === searchConstants.DATA) {
        tabsToRender = dataTab;
    } else if (filter === searchConstants.APPS) {
        tabsToRender = appsTab;
    } else if (filter === searchConstants.ANALYSES) {
        tabsToRender = analysesTab;
    }

    return (
        <Paper className={classes.root}>
            {!isMobile && (
                <Typography className={classes.searchInfo}>
                    {i18Search("searchInfo", { term: `"${searchTerm}"` })}
                    <AnimatedNumber
                        value={dataCount + appsCount + analysesCount}
                        formatValue={(value) => value.toFixed(0)}
                    />{" "}
                    {i18Search("matchingResults")}
                </Typography>
            )}
            <Divider />
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{
                    indicator: classes.tabIndicator,
                    root: classes.tabRoot,
                }}
                centered={!isMobile}
                variant={isMobile ? "fullWidth" : "standard"}
            >
                {tabsToRender}
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
