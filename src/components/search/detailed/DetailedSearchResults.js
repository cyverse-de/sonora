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
import { DETab, DETabPanel } from "components/utils/DETabs";

import SEARCH_RESULTS_TABS from "components/search/detailed/tabs";
import { TeamIcon } from "components/teams/Icons";
import TeamSearchResults from "./TeamSearchResults";
import AnalysesIcon from "components/icons/AnalysesIcon";
import DataIcon from "components/icons/DataIcon";

import {
    Divider,
    IconButton,
    makeStyles,
    Paper,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
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
    selectedTabIcon: {
        fontSize: "1.5rem",
    },
    tabIcon: {
        color: theme.palette.info.main,
        fontSize: "1.5rem",
    },
    searchInfo: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.25),
    },
}));

function DetailedSearchResults(props) {
    const { baseId, searchTerm, selectedTab, onTabSelectionChange } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation(["common", "search"]);

    const [appsCount, setAppsCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [analysesCount, setAnalysesCount] = useState(0);
    const [teamCount, setTeamCount] = useState(0);

    const dataTabId = build(baseId, ids.DATA_SEARCH_RESULTS_TAB);
    const appsTabId = build(baseId, ids.APPS_SEARCH_RESULTS_TAB);
    const analysesTabId = build(baseId, ids.ANALYSES_SEARCH_RESULTS_TAB);
    const teamTabId = build(baseId, ids.TEAM_SEARCH_RESULTS_TAB);

    const dataTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.data ? (
            <DataIcon className={classes.selectedTabIcon} />
        ) : (
            <DataIcon className={classes.tabIcon} />
        );
    const appsTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.apps ? (
            <AppsIcon className={classes.selectedTabIcon} />
        ) : (
            <AppsIcon className={classes.tabIcon} />
        );
    const analysesTabIcon =
        selectedTab === SEARCH_RESULTS_TABS.analyses ? (
            <AnalysesIcon className={classes.selectedTabIcon} />
        ) : (
            <AnalysesIcon className={classes.tabIcon} />
        );

    const totalResults = dataCount + appsCount + analysesCount + teamCount;

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
                <DETab
                    value={SEARCH_RESULTS_TABS.data}
                    key={dataTabId}
                    id={dataTabId}
                    label={
                        isMobile
                            ? `(${dataCount})`
                            : t("search:dataSearchTab", { count: dataCount })
                    }
                    icon={dataTabIcon}
                />
                <DETab
                    value={SEARCH_RESULTS_TABS.apps}
                    key={appsTabId}
                    id={appsTabId}
                    label={
                        isMobile
                            ? `(${appsCount})`
                            : t("search:appsSearchTab", { count: appsCount })
                    }
                    icon={appsTabIcon}
                />
                <Tab
                    value={SEARCH_RESULTS_TABS.analyses}
                    key={analysesTabId}
                    id={analysesTabId}
                    label={
                        isMobile
                            ? `(${analysesCount})`
                            : t("search:analysesSearchTab", {
                                  count: analysesCount,
                              })
                    }
                    classes={{ selected: classes.tabSelected }}
                    icon={analysesTabIcon}
                />
                <Tab
                    value={SEARCH_RESULTS_TABS.teams}
                    key={teamTabId}
                    id={teamTabId}
                    label={
                        isMobile
                            ? teamCount
                            : t("search:teamSearchTab", { count: teamCount })
                    }
                    classes={{ selected: classes.tabSelected }}
                    icon={<TeamIcon />}
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
            <DETabPanel
                tabId={teamTabId}
                value={SEARCH_RESULTS_TABS.teams}
                selectedTab={selectedTab}
            >
                <TeamSearchResults
                    searchTerm={searchTerm}
                    updateResultCount={(count) => setTeamCount(count)}
                    baseId={teamTabId}
                />
            </DETabPanel>
        </Paper>
    );
}

export default DetailedSearchResults;
