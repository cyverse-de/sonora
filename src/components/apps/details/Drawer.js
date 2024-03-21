/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as description, rating, documentation, saved launches about an app.
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import { useQueryClient, useMutation, useQuery } from "react-query";

import DetailsPanel from "./DetailsPanel";
import { Documentation } from "./AppDoc";
import ToolsUsedPanel from "./ToolUsedPanel";
import AppFavorite from "../AppFavorite";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import VersionSelection from "components/apps/VersionSelection";
import ids from "../../apps/ids";
import { DETab, DETabPanel, DETabs } from "../../utils/DETabs";

import constants from "../../../constants";

import { getHost } from "components/utils/getHost";
import { getAppListingLinkRefs } from "components/apps/utils";

import {
    APP_DETAILS_QUERY_KEY,
    getAppDetails,
    rateApp,
} from "serviceFacades/apps";

import buildID from "components/utils/DebugIDUtil";
import CopyTextArea from "components/copy/CopyTextArea";
import Rate from "components/rating/Rate";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";
import Close from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";

const TABS = {
    appInfo: "APP INFORMATION",
    toolInfo: "TOOL(S) USED BY THIS APP",
    docs: "APP DOCS",
};
const useStyles = makeStyles()((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("xl")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("xl")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("md")]: {
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

    headerOperations: {
        marginLeft: theme.spacing(1),
    },
}));

function DetailsHeader({ app, isExternal, classes, baseId }) {
    const { t } = useTranslation("apps");
    const [link, setLink] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const host = getHost();
        const partialLink = getAppListingLinkRefs(app?.system_id, app?.id)[1];
        setLink(`${host}${partialLink}`);
    }, [app]);

    const appName = app?.name;
    const isPublic = app?.is_public;

    return (
        <>
            <Typography variant="h6" component="span">
                {appName}
            </Typography>

            <div className={classes.headerOperations}>
                {!isExternal && isPublic && (
                    <AppFavorite
                        baseId={baseId}
                        app={app}
                        isExternal={isExternal}
                    />
                )}
                <Tooltip title={t("linkToThisApp", { name: appName })}>
                    <IconButton size="small" onClick={() => setOpen(true)}>
                        <LinkIcon color="primary" fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
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
                        debugIdPrefix={buildID(baseId, app?.id)}
                    />
                </DialogContent>
            </Dialog>
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
    const { classes } = useStyles();
    const {
        systemId,
        appId,
        versionId: initialVersionId,
        open,
        onClose,
    } = props;

    const { t } = useTranslation("apps");

    const [versionId, setVersionId] = useState(initialVersionId);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedTab, setSelectedTab] = useState(TABS.appInfo);
    const [detailsError, setDetailsError] = useState(null);
    const [ratingMutationError, setRatingMutationError] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleClose = () => {
        if (dirty) {
            setOpenConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const isExternal =
        selectedApp?.app_type.toUpperCase() ===
        constants.APP_TYPE_EXTERNAL.toUpperCase();

    const isPublic = selectedApp?.is_public;

    const {
        average: averageRating,
        total: totalRating,
        user: userRating,
    } = selectedApp?.rating || { average: 0, total: 0, user: 0 };

    const drawerId = ids.DETAILS_DRAWER;
    const detailsTabId = buildID(drawerId, ids.DETAILS_TAB);
    const toolInfoTabId = buildID(drawerId, ids.TOOLS_INFO_TAB);
    const docsTabId = buildID(drawerId, ids.DOCS_TAB);

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { isFetching: detailsLoading } = useQuery({
        queryKey: [
            APP_DETAILS_QUERY_KEY,
            {
                systemId,
                appId,
                versionId,
            },
        ],
        queryFn: () =>
            getAppDetails({
                systemId,
                appId,
                versionId,
            }),

        enabled: !!appId && !!systemId,
        onSuccess: setSelectedApp,
        onError: (e) => {
            setDetailsError(e);
            setRatingMutationError(null);
        },
    });

    const { mutate: rating, status: ratingMutationStatus } = useMutation(
        rateApp,
        {
            onSuccess: () =>
                queryClient.invalidateQueries([
                    APP_DETAILS_QUERY_KEY,
                    { systemId, appId },
                ]),
            onError: (e) => {
                setRatingMutationError(e);
                setDetailsError(null);
            },
        }
    );

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
            onClose={handleClose}
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
                    app={selectedApp}
                    isExternal={isExternal}
                    classes={classes}
                    baseId={drawerId}
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
            <div className={classes.drawerSubHeader}>
                {!detailsLoading && selectedApp?.versions && (
                    <VersionSelection
                        baseId={drawerId}
                        version_id={selectedApp?.version_id}
                        versions={selectedApp?.versions}
                        onChange={setVersionId}
                    />
                )}
            </div>
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.appInfo}
                    label={t("details")}
                    id={detailsTabId}
                    aria-controls={buildID(detailsTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.toolInfo}
                    label={t("toolsUsedByApp")}
                    id={toolInfoTabId}
                    aria-controls={buildID(toolInfoTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.docs}
                    label={t("documentation")}
                    id={docsTabId}
                    aria-controls={buildID(docsTabId, ids.PANEL)}
                />
            </DETabs>
            <DETabPanel
                tabId={detailsTabId}
                value={TABS.appInfo}
                selectedTab={selectedTab}
            >
                <DetailsPanel
                    details={selectedApp}
                    userRating={userRating}
                    isPublic={isPublic}
                    isExternal={isExternal}
                    detailsLoadingStatus={detailsLoading}
                    ratingMutationStatus={
                        ratingMutationStatus === constants.LOADING
                    }
                    baseId={drawerId}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRating}
                    detailsError={detailsError}
                    ratingMutationError={ratingMutationError}
                />
            </DETabPanel>
            <DETabPanel
                tabId={toolInfoTabId}
                value={TABS.toolInfo}
                selectedTab={selectedTab}
            >
                <ToolsUsedPanel
                    details={selectedApp}
                    baseId={drawerId}
                    loading={detailsLoading}
                    error={detailsError}
                />
            </DETabPanel>
            <DETabPanel
                tabId={docsTabId}
                value={TABS.docs}
                selectedTab={selectedTab}
            >
                <Documentation
                    baseId={drawerId}
                    appId={appId}
                    versionId={versionId}
                    systemId={systemId}
                    app={selectedApp}
                    appLoading={detailsLoading}
                    appError={detailsError}
                    setDirty={setDirty}
                />
            </DETabPanel>
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title={t("discardChanges")}
                contentText={t("docUnsavedPrompt")}
                onConfirm={() => {
                    setOpenConfirmDialog(false);
                    onClose();
                }}
            />
        </Drawer>
    );
}

export default DetailsDrawer;
