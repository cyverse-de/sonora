/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as description, rating, documentation, quick launches about an app.
 *
 */

import React, { useState } from "react";

import ids from "../../apps/ids";
import DETabPanel from "../../utils/DETabPanel";
import messages from "../../apps/messages";
import DetailsPanel from "./DetailsPanel";
import constants from "../../../constants";

import {
    build,
    formatMessage,
    getMessage,
    Rate,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    CircularProgress,
    Drawer,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ToolsUsedPanel from "./ToolUsedPanel";
import AppFavorite from "../AppFavorite";
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

function DetailsHeader({
    loading,
    appName,
    isExternal,
    isPublic,
    isFavorite,
    onFavoriteClick,
    intl,
    classes,
    baseId,
}) {
    return (
        <>
            <Typography variant="h6" component="span">
                {appName}
            </Typography>
            {!isExternal && isPublic && (
                <div className={classes.headerOperations}>
                    <AppFavorite
                        intl={intl}
                        baseId={baseId}
                        isFavorite={isFavorite}
                        isExternal={isExternal}
                        onFavoriteClick={onFavoriteClick}
                    />
                    {/*TODO: Sriram - implement app link*/}
                    <Tooltip title={formatMessage(intl, "linkToThisApp")}>
                        <IconButton size="small">
                            <LinkIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
            {loading && <CircularProgress size={30} thickness={5} />}
        </>
    );
}

function DetailsSubHeader({
    appId,
    isExternal,
    isPublic,
    averageRating,
    totalRating,
}) {
    if (!isExternal && isPublic) {
        return (
            <Rate
                name={appId}
                value={averageRating}
                readOnly={true}
                total={totalRating}
            />
        );
    } else {
        return null;
    }
}

function DetailsDrawer(props) {
    const classes = useStyles();
    const {
        selectedApp,
        details,
        open,
        onClose,
        baseId,
        intl,
        onFavoriteClick,
        onRatingChange,
        onDeleteRatingClick,
        detailsLoadingStatus,
        ratingMutationStatus,
        favMutationStatus,
        detailsError,
        favMutationError,
        ratingMutationError,
    } = props;
    const [selectedTab, setSelectedTab] = useState(TABS.appInfo);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    if (!selectedApp) {
        return null;
    }

    const isExternal =
        selectedApp.app_type.toUpperCase() ===
        constants.EXTERNAL_APP_TYPE.toUpperCase();

    const appId = selectedApp.id;
    const appName = selectedApp.name;
    const isPublic = selectedApp.is_public;
    const isFavorite = selectedApp.is_favorite;
    const { average: averageRating, total: totalRating } = selectedApp.rating;

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
                <DetailsHeader
                    loading={favMutationStatus}
                    appName={appName}
                    isExternal={isExternal}
                    isPublic={isPublic}
                    isFavorite={isFavorite}
                    onFavoriteClick={onFavoriteClick}
                    intl={intl}
                    classes={classes}
                    baseId={baseId}
                />
            </div>
            <div className={classes.drawerSubHeader}>
                <DetailsSubHeader
                    appId={appId}
                    averageRating={averageRating}
                    isExternal={isExternal}
                    isPublic={isPublic}
                    totalRating={totalRating}
                />
            </div>
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
                    detailsLoadingStatus={detailsLoadingStatus}
                    ratingMutationStatus={ratingMutationStatus}
                    baseId={baseId}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRatingClick}
                    onFavoriteClick={onFavoriteClick}
                    detailsError={detailsError}
                    favMutationError={favMutationError}
                    ratingMutationError={ratingMutationError}
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
                    loading={detailsLoadingStatus}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default withI18N(injectIntl(DetailsDrawer), messages);
