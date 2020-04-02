/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as description, rating, documentation, quick launches about an app.
 *
 */

import React, { useEffect, useState } from "react";

import ids from "../../apps/ids";
import DETabPanel from "../../utils/DETabPanel";
import messages from "../../apps/messages";
import DetailsPanel from "./DetailsPanel";
import { getAppDetails } from "../../../serviceFacade/appServiceFacade";
import constants from "../../../constants";

import { build, getMessage, Rate, withI18N } from "@cyverse-de/ui-lib";
import { Drawer, IconButton, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useQuery } from "react-query";
import ToolsUsedPanel from "./ToolUsedPanel";
import { AppFavorite } from "../AppFavorite";
import { injectIntl } from "react-intl";
import LinkIcon from "@material-ui/icons/Link";

const TABS = {
    appInfo: "APP INFORMATION",
    toolInfo: "TOOL(S) USED BY THIS APP",
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
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
    drawerSubHeader: {
        paddingLeft: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },

    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
    },
    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
}));

function DetailsDrawer(props) {
    const { selectedApp, open, onClose, baseId, intl } = props;
    const classes = useStyles();

    const [selectedTab, setSelectedTab] = useState(TABS.appInfo);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [detailsKey, setDetailsKey] = useState(null);
    const { status } = useQuery({
        queryKey: detailsKey,
        queryFn: getAppDetails,
        config: {
            onSuccess: setDetails,
            refetchOnWindowFocus: false,
            onError: setError,
        },
    });
    useEffect(() => {
        if (selectedApp) {
            setDetailsKey([
                "getAppsDetails",
                {
                    systemId: selectedApp.system_id,
                    appId: selectedApp.id,
                },
            ]);
        }
    }, [selectedApp]);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const onDeleteRatingClick = () => {
    };

    const onRatingChange = () => {
    };

    const onFavoriteClick = () => {
    };

    const isExternal =
        selectedApp.app_type.toUpperCase() ===
        constants.EXTERNAL_APP_TYPE.toUpperCase();

    const isPublic = selectedApp.is_public;

    const {
        average: averageRating,
        total: totalRating,
    } = selectedApp.rating;

    const drawerId = build(baseId, ids.DETAILS_DRAWER);
    const detailsTabId = build(drawerId, ids.DETAILS_TAB);
    const toolInfoTabId = build(drawerId, ids.TOOLS_INFO_TAB);

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
                <Typography variant="h6" component="span">
                    {selectedApp.name}
                </Typography>
                {!isExternal && isPublic && (
                    <>
                        <AppFavorite
                            intl={intl}
                            baseId={baseId}
                            isFavorite={selectedApp.is_favorite}
                            isExternal={isExternal}
                        />
                        <IconButton size="small">
                            <LinkIcon color="primary"/>
                        </IconButton>
                    </>
                )}
            </div>
            {!isExternal && isPublic && (
                <div className={classes.drawerSubHeader}>
                    <Rate
                        name={selectedApp.id}
                        value={averageRating}
                        readOnly={true}
                        total={totalRating}
                    />
                </div>
            )}
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
            >
                <Tab
                    value={TABS.appInfo}
                    label={getMessage("details")}
                    id={detailsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(detailsTabId, ids.PANEL)}
                />
                <Tab
                    value={TABS.toolInfo}
                    label={getMessage("toolsUsedByApp")}
                    id={toolInfoTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(toolInfoTabId, ids.PANEL)}
                />
            </Tabs>
            <DETabPanel
                tabId={detailsTabId}
                value={TABS.appInfo}
                selectedTab={selectedTab}
            >
                <DetailsPanel
                    app={selectedApp}
                    details={details}
                    isPublic={isPublic}
                    isExternal={isExternal}
                    loading={status === constants.LOADING}
                    error={error}
                    baseId={baseId}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRatingClick}
                    onFavoriteClick={onFavoriteClick}
                />
            </DETabPanel>
            <DETabPanel
                tabId={toolInfoTabId}
                value={TABS.toolInfo}
                selectedTab={selectedTab}
            >
                <ToolsUsedPanel
                    details={details}
                    baseId={baseId}
                    loading={status === constants.LOADING}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default withI18N(injectIntl(DetailsDrawer), messages);
