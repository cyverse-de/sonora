/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as description, rating, documentation, quick launches about an app.
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import { queryCache, useMutation, useQuery } from "react-query";

import ToolsUsedPanel from "./ToolUsedPanel";
import AppFavorite from "../AppFavorite";

import ids from "../../apps/ids";
import DETabPanel from "../../utils/DETabPanel";

import DetailsPanel from "./DetailsPanel";
import constants from "../../../constants";

import NavigationConstants from "common/NavigationConstants";

import {
    appFavorite,
    getAppDetails,
    getAppById,
    rateApp,
    APP_BY_ID_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
} from "serviceFacades/apps";

import { build, CopyTextArea, Rate } from "@cyverse-de/ui-lib";
import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
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
    appId,
    systemId,
    loading,
    appName,
    isExternal,
    isPublic,
    isFavorite,
    onFavoriteClick,
    classes,
    baseId,
}) {
    const { t } = useTranslation("apps");
    const [link, setLink] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const protocol = window.location.protocol.concat("//");
        const host = protocol.concat(window.location.host);
        setLink(
            host.concat(`/${NavigationConstants.APPS}/${systemId}/${appId}`)
        );
    }, [appId, systemId]);

    return (
        <>
            <Typography variant="h6" component="span">
                {appName}
            </Typography>
            {!isExternal && isPublic && (
                <div className={classes.headerOperations}>
                    <AppFavorite
                        baseId={baseId}
                        isFavorite={isFavorite}
                        isExternal={isExternal}
                        onFavoriteClick={onFavoriteClick}
                    />
                    <Tooltip title={t("linkToThisApp", { name: appName })}>
                        <IconButton size="small" onClick={() => setOpen(true)}>
                            <LinkIcon color="primary" fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>
                    {t("linkToThisApp", { name: appName })}
                    <IconButton
                        size="small"
                        onClick={() => setOpen(false)}
                        style={{ float: "right" }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CopyTextArea
                        text={link}
                        debugIdPrefix={build(baseId, appId)}
                    />
                </DialogContent>
            </Dialog>
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
    const { appId, systemId, open, onClose, baseId } = props;

    const { t } = useTranslation("apps");

    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedTab, setSelectedTab] = useState(TABS.appInfo);
    const [detailsError, setDetailsError] = useState(null);
    const [favMutationError, setFavMutationError] = useState(null);
    const [ratingMutationError, setRatingMutationError] = useState(null);
    const [details, setDetails] = useState(null);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const isExternal =
        selectedApp?.app_type.toUpperCase() ===
        constants.APP_TYPE_EXTERNAL.toUpperCase();

    const appName = selectedApp?.name;
    const isPublic = selectedApp?.is_public;
    const isFavorite = selectedApp?.is_favorite;
    const {
        average: averageRating,
        total: totalRating,
        user: userRating,
    } = selectedApp?.rating || { average: 0, total: 0, user: 0 };

    const drawerId = build(baseId, ids.DETAILS_DRAWER);
    const detailsTabId = build(drawerId, ids.DETAILS_TAB);
    const toolInfoTabId = build(drawerId, ids.TOOLS_INFO_TAB);

    const { isFetching: appByIdStatus, error: appByIdError } = useQuery({
        queryKey: [APP_BY_ID_QUERY_KEY, { systemId, appId }],
        queryFn: getAppById,
        config: {
            enabled: appId != null && systemId !== null,
            onSuccess: (result) => {
                setSelectedApp(result?.apps[0]);
            },
        },
    });

    const { isFetching: detailsStatus } = useQuery({
        queryKey: [
            APP_DETAILS_QUERY_KEY,
            {
                systemId,
                appId,
            },
        ],
        queryFn: getAppDetails,
        config: {
            enabled: appId != null && systemId !== null,
            onSuccess: setDetails,
            onError: (e) => {
                setDetailsError(e);
                setFavMutationError(null);
                setRatingMutationError(null);
            },
        },
    });

    const [favorite, { status: favMutationStatus }] = useMutation(appFavorite, {
        onSuccess: () =>
            queryCache.invalidateQueries([
                APP_BY_ID_QUERY_KEY,
                { systemId, appId },
            ]),
        onError: (e) => {
            setFavMutationError(e);
            setDetailsError(null);
            setRatingMutationError(null);
        },
    });

    const [rating, { status: ratingMutationStatus }] = useMutation(rateApp, {
        onSuccess: () =>
            queryCache.invalidateQueries([
                APP_BY_ID_QUERY_KEY,
                { systemId, appId },
            ]),
        onError: (e) => {
            setRatingMutationError(e);
            setDetailsError(null);
            setFavMutationError(null);
        },
    });

    const onFavoriteClick = () => {
        favorite({
            isFav: !selectedApp.is_favorite,
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
        });
    };

    const onRatingChange = (event, value) => {
        rating({
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
            rating: value,
        });
    };

    const onDeleteRating = () => {
        rating({
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
            rating: null,
        });
    };

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
                    appId={appId}
                    systemId={systemId}
                    loading={favMutationStatus === constants.LOADING}
                    appName={appName}
                    isExternal={isExternal}
                    isPublic={isPublic}
                    isFavorite={isFavorite}
                    onFavoriteClick={onFavoriteClick}
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
                    label={t("details")}
                    id={detailsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(detailsTabId, ids.PANEL)}
                />
                <Tab
                    value={TABS.toolInfo}
                    label={t("toolsUsedByApp")}
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
                    details={details}
                    userRating={userRating}
                    isPublic={isPublic}
                    isExternal={isExternal}
                    detailsLoadingStatus={detailsStatus || appByIdStatus}
                    ratingMutationStatus={
                        ratingMutationStatus === constants.LOADING
                    }
                    baseId={baseId}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRating}
                    onFavoriteClick={onFavoriteClick}
                    detailsError={detailsError || appByIdError}
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
                    loading={detailsStatus || appByIdStatus}
                    error={detailsError || appByIdError}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default DetailsDrawer;
