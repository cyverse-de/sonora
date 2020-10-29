/**
 *
 * A component that displays detailed search results.
 *
 * @author sriram
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";
import AnimatedNumber from "animated-number-react";

import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import AppSearchResults from "./AppSearchResults";
import DataSearchResults from "./DataSearchResults";
import AnalysesSearchResults from "./AnalysesSearchResults";
import DETabPanel from "components/utils/DETabPanel";

import {
    Divider,
    Paper,
    IconButton,
    makeStyles,
    useMediaQuery,
    useTheme,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

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

const SEARCH_RESULTS_TABS = {
    data: "DATA",
    apps: "APPS",
    analyses: "ANALYSES",
};

function DetailedSearchResults(props) {
    const { baseId, searchTerm, selectedTab, onTabSelectionChange } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation(["common", "search"]);

    const [appsCount, setAppsCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [analysesCount, setAnalysesCount] = useState(0);

    const dataTabId = build(baseId, ids.DATA_SEARCH_RESULTS_TAB);
    const appsTabId = build(baseId, ids.APPS_SEARCH_RESULTS_TAB);
    const analysesTabId = build(baseId, ids.ANALYSES_SEARCH_RESULTS_TAB);

    const dataTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.data
            ? "/data_selected.png"
            : "/icon-data.png";
    const appsTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.apps
            ? "/apps_selected.png"
            : "/icon-apps.png";
    const analysesTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.analyses
            ? "/analyses_selected.png"
            : "/icon-analyses.png";

    const totalResults = dataCount + appsCount + analysesCount;

    if (!searchTerm && !isMobile) {
        return (
            <div>
                <span>
                    <IconButton disabled>
                        <SearchIcon color="primary" />
                    </IconButton>
                </span>
                <Typography className={classes.searchInfo} component="span">
                    {t("search:searchPagePrompt")}
                </Typography>
            </div>
        );
    }

    return (
        <Paper className={classes.root}>
            {!isMobile && (
                <Typography className={classes.searchInfo}>
                    {t("search:searchInfo", { term: `"${searchTerm}"` })}
                    <AnimatedNumber
                        value={totalResults}
                        formatValue={(value) => value.toFixed(0)}
                    />{" "}
                    {t("search:matchingResults")}
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
                <Tab
                    value={SEARCH_RESULTS_TABS.data}
                    key={dataTabId}
                    id={dataTabId}
                    label={
                        isMobile
                            ? dataCount
                            : t("search:dataSearchTab", { count: dataCount })
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
                <Tab
                    value={SEARCH_RESULTS_TABS.apps}
                    key={appsTabId}
                    id={appsTabId}
                    label={
                        isMobile
                            ? appsCount
                            : t("search:appsSearchTab", { count: appsCount })
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
                <Tab
                    value={SEARCH_RESULTS_TABS.analyses}
                    key={analysesTabId}
                    id={analysesTabId}
                    label={
                        isMobile
                            ? analysesCount
                            : t("search:analysesSearchTab", {
                                  count: analysesCount,
                              })
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
            </Tabs>

            <DETabPanel
                tabId={dataTabId}
                value={SEARCH_RESULTS_TABS.data}
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
                value={SEARCH_RESULTS_TABS.apps}
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
                value={SEARCH_RESULTS_TABS.analyses}
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
export { SEARCH_RESULTS_TABS };
export default DetailedSearchResults;
