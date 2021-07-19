/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */

import React, { useCallback, useEffect, useState } from "react";

import { Trans } from "react-i18next";
import TableView from "./TableView";

import ids from "../ids";
import globalConstants from "../../../constants";
import Drawer from "../details/Drawer";
import FileBrowser from "../toolbar/FileBrowser";
import DataToolbar from "../toolbar/Toolbar";

import { camelcaseit } from "common/functions";
import { NavigationParams } from "common/NavigationConstants";

import DEPagination from "components/utils/DEPagination";
import ResourceTypes from "components/models/ResourceTypes";
import isQueryLoading from "components/utils/isQueryLoading";
import URLImportDialog from "components/urlImport";
import UploadDialog from "components/uploads/dialog";
import {
    processSelectedFiles,
    trackUpload,
} from "components/uploads/UploadDrop";
import UploadDropTarget from "components/uploads/UploadDropTarget";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import Sharing from "components/sharing";
import { formatSharedData } from "components/sharing/util";
import { getPageQueryParams } from "../utils";
import { getHost } from "components/utils/getHost";
import RenameDialog from "components/data/RenameDialog";
import {
    useUploadTrackingState,
    useUploadTrackingDispatch,
} from "contexts/uploadTracking";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import {
    deleteResources,
    emptyTrash,
    restore,
    getInfoTypes,
    getPagedListing,
    DATA_LISTING_QUERY_KEY,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";

import {
    getDefaultsMapping,
    DEFAULTS_MAPPING_QUERY_KEY,
} from "serviceFacades/instantlaunches";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import buildID from "components/utils/DebugIDUtil";

import { useTranslation } from "i18n";
import { useBagAddItems } from "serviceFacades/bags";

import { queryCache, useMutation, useQuery } from "react-query";

import { Button, Typography, useTheme } from "@material-ui/core";
import DEDialog from "components/utils/DEDialog";
import PublicLinks from "../PublicLinks";
import constants from "../../../constants";
import ExternalLink from "components/utils/ExternalLink";
import { createDOIRequest } from "serviceFacades/doi";
import MoveDialog from "../MoveDialog";

function Listing(props) {
    const {
        baseId,
        path,
        handlePathChange,
        multiSelect = true,
        isInvalidSelection = () => false,
        render,
        showErrorAnnouncer,
        onCreateFileSelected,
        page,
        rowsPerPage,
        order,
        orderBy,
        onRouteToListing,
        toolbarVisibility = true,
        rowDotMenuVisibility = true,
    } = props;
    const { t } = useTranslation("data");

    const uploadTracker = useUploadTrackingState();
    const theme = useTheme();
    const [isGridView, setGridView] = useState(false);

    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [data, setData] = useState({ total: 0, listing: [] });
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [confirmDOIRequestDialogOpen, setConfirmDOIRequestDialogOpen] =
        useState(false);

    const [instantLaunchDefaultsMapping, setInstantLaunchDefaultsMapping] =
        useState({});

    const [navError, setNavError] = useState(null);

    // Used to force the data listing to refresh when uploads are completed.
    const uploadsCompleted = uploadTracker.uploads.filter((upload) => {
        return (
            upload.parentPath === path &&
            upload.hasUploaded &&
            !upload.hasErrored
        );
    }).length;

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [publicLinksDlgOpen, setPublicLinksDlgOpen] = useState(false);
    const [download, setDownload] = useState(false);
    const [renameDlgOpen, setRenameDlgOpen] = useState(false);
    const [moveDlgOpen, setMoveDlgOpen] = useState(false);

    const onRenameClicked = () => setRenameDlgOpen(true);
    const onRenameDlgClose = () => setRenameDlgOpen(false);
    const onCloseImportDialog = () => setImportDialogOpen(false);

    const uploadDispatch = useUploadTrackingDispatch();

    const trackAllUploads = (uploadFiles) => {
        uploadFiles.forEach((aFile) => {
            trackUpload(aFile.value, path, uploadDispatch);
        });
    };
    const handleUploadFiles = (files) => {
        processSelectedFiles(files, trackAllUploads);
    };

    const getSelectedResources = useCallback(
        (resources) => {
            const items = resources ? resources : selected;
            return items.map((id) =>
                data?.listing?.find((resource) => resource.id === id)
            );
        },
        [data.listing, selected]
    );

    const { error, isFetching } = useQuery({
        queryKey: [
            DATA_LISTING_QUERY_KEY,
            path,
            rowsPerPage,
            orderBy,
            order,
            page,
            uploadsCompleted,
        ],
        queryFn: getPagedListing,
        config: {
            enabled: !!path,
            onSuccess: (respData) => {
                trackIntercomEvent(IntercomEvents.VIEWED_FOLDER, {
                    path,
                });
                setData({
                    total: respData?.total,
                    permission: respData?.permission,
                    listing: [
                        ...respData?.folders.map((f) => ({
                            ...f,
                            type: ResourceTypes.FOLDER,
                        })),
                        ...respData?.files.map((f) => ({
                            ...f,
                            type: ResourceTypes.FILE,
                        })),
                    ].map((i) => camelcaseit(i)), // camelcase the fields for each object, for consistency.
                });
            },
        },
    });

    const { defaultsMappingError, isFetchingDefaultsMapping } = useQuery({
        queryKey: [DEFAULTS_MAPPING_QUERY_KEY],
        queryFn: getDefaultsMapping,
        config: {
            enabled: true,
            onSuccess: (respData) => {
                setInstantLaunchDefaultsMapping(respData?.mapping || {});
            },
        },
    });

    const refreshListing = () =>
        queryCache.invalidateQueries(
            [
                DATA_LISTING_QUERY_KEY,
                path,
                rowsPerPage,
                orderBy,
                order,
                page,
                uploadsCompleted,
            ],
            { force: true }
        );

    const [removeResources, { status: removeResourceStatus }] = useMutation(
        deleteResources,
        {
            onSuccess: () => {
                announce({
                    text: t("asyncDataDeletePending"),
                    variant: INFO,
                });
            },
            onError: (e) => {
                showErrorAnnouncer(t("deleteResourceError"), e);
            },
        }
    );
    const [requestDOI, { status: requestDOIStatus }] = useMutation(
        createDOIRequest,
        {
            onSuccess: (resp) => {
                trackIntercomEvent(IntercomEvents.SUBMITTED_DOI_REQUEST, {
                    folder: selected[0],
                });
            },
            onError: (e) => {
                showErrorAnnouncer(t("doiRequestFailed"), e);
            },
        }
    );
    const [doEmptyTrash, { status: emptyTrashStatus }] = useMutation(
        emptyTrash,
        {
            onSuccess: () => {
                announce({
                    text: t("asyncDataEmptyTrashPending"),
                    variant: INFO,
                });
            },
            onError: (e) => {
                showErrorAnnouncer(t("emptyTrashError"), e);
            },
        }
    );

    const [doRestore, { status: restoreStatus }] = useMutation(restore, {
        onSuccess: () => {
            announce({
                text: t("asyncDataRestorePending"),
                variant: INFO,
            });
        },
        onError: (e) => {
            showErrorAnnouncer(t("restoreError"), e);
        },
    });

    useEffect(() => {
        setSelected([]);
    }, [path, rowsPerPage, orderBy, order, page, uploadsCompleted]);

    const viewUploadQueue = useCallback(() => {
        return (
            <Button
                variant="outlined"
                onClick={() => setUploadDialogOpen(true)}
            >
                <Typography
                    variant="button"
                    style={{ color: theme.palette.primary.contrastText }}
                >
                    {t("uploadQueue")}
                </Typography>
            </Button>
        );
    }, [t, theme.palette.primary.contrastText]);

    useEffect(() => {
        if (uploadTracker.uploads.length > 0) {
            announce({
                text: t("filesQueuedForUploadMsg", {
                    count: uploadTracker.uploads.length,
                }),
                CustomAction: viewUploadQueue,
            });
        }
    }, [uploadTracker, t, viewUploadQueue]);

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(t("infoTypeFetchError"), e);
            },
        },
    });

    useEffect(() => {
        setDetailsEnabled(selected && selected.length === 1);
    }, [selected]);

    useEffect(() => {
        if (download) {
            const selRes = getSelectedResources();
            selRes.forEach((res) => {
                window.open(
                    `${getHost()}/api/download?path=${res.path}`,
                    "_blank"
                );
            });

            setDownload(false);
        }
    }, [path, download, getSelectedResources]);

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === globalConstants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                path,
                isAsc
                    ? globalConstants.SORT_DESCENDING
                    : globalConstants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage
            );
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length && multiSelect) {
            const newSelecteds =
                data?.listing?.map((resource) => resource.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const toggleDisplay = () => {
        setGridView(!isGridView);
    };

    // Simple range select: if you shift-click a range, the range will be
    // selected.  If all items in the range are already selected, all items
    // will be deselected.
    const rangeSelect = (start, end, targetId) => {
        if (start > -1) {
            const rangeIds = [];
            for (let i = start; i <= end; i++) {
                rangeIds.push(data?.listing[i].id);
            }

            let isTargetSelected = selected.includes(targetId);
            isTargetSelected ? deselect(rangeIds) : select(rangeIds);
        }
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey && multiSelect) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            setSelected([id]);
        }

        setLastSelectIndex(index);
    };

    const handleCheckboxClick = (event, id, index) => {
        toggleSelection(id);
        setLastSelectIndex(index);
    };

    const toggleSelection = (resourceId) => {
        if (selected.includes(resourceId)) {
            deselect([resourceId]);
        } else {
            select([resourceId]);
        }
    };

    const select = (resourceIds) => {
        if (multiSelect) {
            let newSelected = [...new Set([...selected, ...resourceIds])];
            setSelected(newSelected);
        } else {
            setSelected(resourceIds);
        }
    };

    const deselect = (resourceIds) => {
        const newSelected = selected.filter(
            (selectedID) => !resourceIds.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const onMetadataSelected = (resourceId) => {
        const resources = getSelectedResources([resourceId]);
        if (resources) {
            const resource = resources[0];
            onPathChange(
                resource.path,
                resource.type,
                resourceId,
                NavigationParams.VIEW.METADATA
            );
        }
    };

    const onDeleteSelected = (resourceId) => {
        const items = resourceId ? [resourceId] : null;
        const paths = getSelectedResources(items).map(
            (resource) => resource.path
        );
        removeResources({ paths });
        setSelected([]);
    };

    const onRestoreSelected = (resourceId) => {
        const items = resourceId ? [resourceId] : null;
        const paths = getSelectedResources(items).map(
            (resource) => resource.path
        );
        doRestore({ paths });
        setSelected([]);
    };

    const onEmptyTrashSelected = () => {
        doEmptyTrash();
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        onRouteToListing &&
            onRouteToListing(path, order, orderBy, newPage - 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(
                path,
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10)
            );
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
        const selectedId = selected[0];
        const resourceIndex = data.listing.findIndex(
            (item) => item.id === selectedId
        );
        const resource = data.listing[resourceIndex];
        setDetailsResource(resource);
    };

    const onRefreshSelected = () => {
        queryCache.invalidateQueries(DATA_LISTING_QUERY_KEY);
    };

    const addItemsToBag = useBagAddItems({
        handleError: (error) => {
            showErrorAnnouncer(t("addToBagError"), error);
        },
        handleSettled: () => {
            setSelected([]);
        },
    });

    const onAddToBagSelected = () => addItemsToBag(getSelectedResources());

    const getSelectedPaths = (resources) => {
        const selectedResources = getSelectedResources(resources);
        return selectedResources.map((res) => res.path);
    };

    const sharingData = formatSharedData(getSelectedResources());

    if (!infoTypes || infoTypes.length === 0) {
        const infoTypesCache = queryCache.getQueryData("dataFetchInfoTypes");
        if (infoTypesCache) {
            setInfoTypes(infoTypesCache.types);
        }
    }
    const handleDataNavError = useCallback(
        (error) => {
            setNavError(error);
        },
        [setNavError]
    );

    const onPathChange = (path, resourceType, id, view) => {
        if (view === NavigationParams.VIEW.METADATA) {
            handlePathChange(path, { view });
        } else if (!resourceType || resourceType === ResourceTypes.FOLDER) {
            //set page to 0 for the new path
            const queryParams = getPageQueryParams(
                order,
                orderBy,
                0,
                rowsPerPage
            );
            handlePathChange(path, queryParams);
        } else {
            handlePathChange(path, {
                type: resourceType,
                resourceId: id,
            });
        }
    };

    const onMoveSelected = () => {
        setMoveDlgOpen(true);
    };

    const isLoading = isQueryLoading([
        isFetching,
        removeResourceStatus,
        requestDOIStatus,
        emptyTrashStatus,
        restoreStatus,
        isFetchingDefaultsMapping,
    ]);
    const localUploadId = buildID(baseId, ids.UPLOAD_MI, ids.UPLOAD_INPUT);
    return (
        <>
            {render && render(selected.length, getSelectedResources)}
            <UploadDropTarget path={path}>
                <DataToolbar
                    path={path}
                    selected={selected}
                    getSelectedResources={getSelectedResources}
                    handlePathChange={onPathChange}
                    permission={data?.permission}
                    refreshListing={refreshListing}
                    isGridView={isGridView}
                    toggleDisplay={toggleDisplay}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    onRestoreSelected={onRestoreSelected}
                    onEmptyTrashSelected={onEmptyTrashSelected}
                    detailsEnabled={detailsEnabled}
                    onDetailsSelected={onDetailsSelected}
                    onAddToBagSelected={onAddToBagSelected}
                    handleDataNavError={handleDataNavError}
                    baseId={baseId}
                    setUploadDialogOpen={setUploadDialogOpen}
                    setImportDialogOpen={setImportDialogOpen}
                    localUploadId={localUploadId}
                    uploadMenuId={buildID(baseId, ids.TOOLBAR, ids.UPLOAD_MENU)}
                    onCreateFileSelected={(fileType) =>
                        onCreateFileSelected(path, fileType)
                    }
                    setSharingDlgOpen={setSharingDlgOpen}
                    onPublicLinksSelected={() => setPublicLinksDlgOpen(true)}
                    toolbarVisibility={toolbarVisibility}
                    onDownloadSelected={() => setDownload(true)}
                    onRequestDOISelected={() =>
                        setConfirmDOIRequestDialogOpen(true)
                    }
                    onRefreshSelected={onRefreshSelected}
                    onRenameSelected={onRenameClicked}
                    onMoveSelected={onMoveSelected}
                />
                {!isGridView && (
                    <TableView
                        loading={isLoading}
                        error={error || navError || defaultsMappingError}
                        path={path}
                        handlePathChange={onPathChange}
                        listing={data?.listing}
                        baseId={baseId}
                        isInvalidSelection={isInvalidSelection}
                        onDeleteSelected={onDeleteSelected}
                        handleRequestSort={handleRequestSort}
                        handleSelectAllClick={handleSelectAllClick}
                        handleCheckboxClick={handleCheckboxClick}
                        onDetailsSelected={onDetailsSelected}
                        handleClick={handleClick}
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        setSharingDlgOpen={setSharingDlgOpen}
                        onMetadataSelected={onMetadataSelected}
                        onPublicLinksSelected={() =>
                            setPublicLinksDlgOpen(true)
                        }
                        rowDotMenuVisibility={rowDotMenuVisibility}
                        onDownloadSelected={() => setDownload(true)}
                        onRenameSelected={onRenameClicked}
                        onMoveSelected={onMoveSelected}
                        instantLaunchDefaultsMapping={
                            instantLaunchDefaultsMapping
                        }
                    />
                )}
                {isGridView && <span>Coming Soon!</span>}
                {data && data.total > 0 && (
                    <DEPagination
                        page={page + 1}
                        onChange={handleChangePage}
                        totalPages={Math.ceil(data.total / rowsPerPage)}
                        onPageSizeChange={handleChangeRowsPerPage}
                        pageSize={rowsPerPage}
                        baseId={baseId}
                    />
                )}
            </UploadDropTarget>
            {detailsOpen && (
                <Drawer
                    resource={detailsResource}
                    open={detailsOpen}
                    baseId={baseId}
                    infoTypes={infoTypes}
                    onClose={() => setDetailsOpen(false)}
                    onPublicLinksSelected={() => setPublicLinksDlgOpen(true)}
                />
            )}
            <FileBrowser
                id={localUploadId}
                handleUploadFiles={handleUploadFiles}
            />
            <UploadDialog
                open={uploadDialogOpen}
                handleClose={() => setUploadDialogOpen(false)}
            />
            <URLImportDialog
                path={path}
                open={importDialogOpen}
                onClose={onCloseImportDialog}
            />
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingData}
            />
            <DEDialog
                open={publicLinksDlgOpen}
                onClose={() => setPublicLinksDlgOpen(false)}
                title={t("publicLinks")}
                baseId={ids.PUBLIC_LINKS}
            >
                <PublicLinks paths={getSelectedPaths()} />
            </DEDialog>
            <DEDialog
                open={confirmDOIRequestDialogOpen}
                onClose={() => setConfirmDOIRequestDialogOpen(false)}
                baseId={ids.DOI_CONFIRM}
                title={t("requestDOI")}
                actions={
                    <>
                        <Button
                            onClick={() =>
                                setConfirmDOIRequestDialogOpen(false)
                            }
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                setConfirmDOIRequestDialogOpen(false);
                                requestDOI({
                                    folder: selected[0],
                                    type: "DOI",
                                });
                            }}
                        >
                            {t("needDoi")}
                        </Button>
                    </>
                }
            >
                <Trans
                    t={t}
                    i18nKey="requestDOIPrompt"
                    components={{
                        manual: <ExternalLink href={constants.DOI_GUIDE} />,
                    }}
                />
                <br />
                <Trans
                    t={t}
                    i18nKey="requestDOIAgreement"
                    components={{
                        b: <b />,
                        agreement: (
                            <ExternalLink href={constants.DC_USER_AGREEMENT} />
                        ),
                    }}
                />
            </DEDialog>
            <RenameDialog
                path={getSelectedResources()[0]?.path}
                open={renameDlgOpen}
                onClose={onRenameDlgClose}
                onRenamed={onRenameDlgClose}
            />
            <MoveDialog
                path={path}
                open={moveDlgOpen}
                selectedResources={getSelectedResources()}
                onClose={() => setMoveDlgOpen(false)}
                onRemoveResource={(resource) => {
                    const newSelected = selected?.filter(
                        (sel) => sel !== resource?.id
                    );
                    setSelected(newSelected);
                }}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
