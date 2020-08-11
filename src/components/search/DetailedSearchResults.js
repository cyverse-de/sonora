/**
 *
 * A component that displays detailed search results.
 *
 * @author sriram
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import DETabPanel from "../utils/DETabPanel";

import { build } from "@cyverse-de/ui-lib";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
    const { baseId } = props;
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(TABS.data);
    const { t } = useTranslation(["common"]);

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
                centered
            >
                <Tab
                    value={TABS.data}
                    id={dataTabId}
                    label={t("data")}
                    classes={{ selected: classes.tabSelected }}
                />
                <Tab
                    value={TABS.apps}
                    tabId={appsTabId}
                    label={t("apps")}
                    classes={{ selected: classes.tabSelected }}
                />
                <Tab
                    value={TABS.analyses}
                    tabId={analysesTabId}
                    label={t("analyses")}
                    classes={{ selected: classes.tabSelected }}
                />
            </Tabs>
            <DETabPanel
                tabId={dataTabId}
                value={TABS.data}
                selectedTab={selectedTab}
            >
                Data Results
            </DETabPanel>
            <DETabPanel
                tabId={appsTabId}
                value={TABS.apps}
                selectedTab={selectedTab}
            >
                Apps Results
            </DETabPanel>
            <DETabPanel
                tabId={analysesTabId}
                value={TABS.analyses}
                selectedTab={selectedTab}
            >
                Analyses Results
            </DETabPanel>
        </Paper>
    );
}
