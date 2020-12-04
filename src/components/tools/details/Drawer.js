/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as job history, params etc...
 *
 */

import React, { useState, useEffect } from "react";

import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";
import DETabPanel from "../../utils/DETabPanel";

import { Drawer, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const TABS = {
    toolDetails: "TOOL DETAILS",
    appsUsingTool: "APPS USING TOOL",
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
    const { t } = useTranslation("tools");
    const { selectedTool, open, onClose, baseId } = props;
    const [selectedTab, setSelectedTab] = useState(TABS.toolDetails);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    if (!selectedTool) {
        return null;
    }

    const toolName = selectedTool.name;

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
                <Typography variant="h6">{toolName}</Typography>
            </div>
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
            >
                <Tab
                    value={TABS.analysisInfo}
                    label={t("info")}
                    id={infoTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(infoTabId, ids.PANEL)}
                />
                <Tab
                    value={TABS.analysisParams}
                    label={t("analysisParams")}
                    id={paramsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(paramsTabId, ids.PANEL)}
                />
            </Tabs>
            <DETabPanel
                tabId={infoTabId}
                value={TABS.analysisInfo}
                selectedTab={selectedTab}
            ></DETabPanel>
            <DETabPanel
                tabId={paramsTabId}
                value={TABS.analysisParams}
                selectedTab={selectedTab}
            ></DETabPanel>
        </Drawer>
    );
}
export default DetailsDrawer;
