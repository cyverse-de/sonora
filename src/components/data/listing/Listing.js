/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */

import React, { useCallback, useEffect, useState } from "react";

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
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import Sharing from "components/sharing";
import { formatSharedData } from "components/sharing/util";
import { getPageQueryParams } from "../utils";

import {
    useUploadTrackingState,
    useUploadTrackingDispatch,
} from "contexts/uploadTracking";

import {
    deleteResources,
    getInfoTypes,
    getPagedListing,
    DATA_LISTING_QUERY_KEY,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";

import { announce, build, AnnouncerConstants } from "@cyverse-de/ui-lib";

import { useTranslation } from "i18n";
import { useBagAddItems } from "serviceFacades/bags";

import { queryCache, useMutation, useQuery } from "react-query";

import { Button, Typography, useTheme } from "@material-ui/core";
import DEDialog from "components/utils/DEDialog";
import PublicLinks from "../PublicLinks";

function Listing(props) {
    const {
        baseId,
        path,
        handlePathChange,
        multiSelect = true,
        isInvalidSelection = () => false,
        render,
        showErrorAnnouncer,
        onCreateHTFileSelected,
        onCreateMultiInputFileSelected,
        page,
        rowsPerPage,
        order,
        orderBy,
        onRouteToListing,
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
                    type: AnnouncerConstants.SUCCESS,
                });
            },
            onError: (e) => {
                showErrorAnnouncer(t("deleteResourceError"), e);
            },
        }
    );

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

    const onDownloadSelected = (resourceId) => {
        console.log("Download", resourceId);
    };

    const onEditSelected = (resourceId) => {
        console.log("Edit", resourceId);
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

    const addItemsToBag = useBagAddItems({
        handleError: (error) => {
            showErrorAnnouncer(t("addToBagError"), error);
        },
        handleSettled: () => {
            setSelected([]);
        },
    });

    const onAddToBagSelected = () => addItemsToBag(getSelectedResources());

    const getSelectedResources = (resources) => {
        const items = resources ? resources : selected;
        return items.map((id) =>
            data?.listing?.find((resource) => resource.id === id)
        );
    };

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

    const isLoading = isQueryLoading([isFetching, removeResourceStatus]);
    const localUploadId = build(baseId, ids.UPLOAD_MI, ids.UPLOAD_INPUT);
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
                    onDownloadSelected={onDownloadSelected}
                    onEditSelected={onEditSelected}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    detailsEnabled={detailsEnabled}
                    onDetailsSelected={onDetailsSelected}
                    onAddToBagSelected={onAddToBagSelected}
                    handleDataNavError={handleDataNavError}
                    baseId={baseId}
                    setUploadDialogOpen={setUploadDialogOpen}
                    setImportDialogOpen={setImportDialogOpen}
                    localUploadId={localUploadId}
                    uploadMenuId={build(baseId, ids.TOOLBAR, ids.UPLOAD_MENU)}
                    onCreateHTFileSelected={() => onCreateHTFileSelected(path)}
                    onCreateMultiInputFileSelected={() =>
                        onCreateMultiInputFileSelected(path)
                    }
                    setSharingDlgOpen={setSharingDlgOpen}
                    onPublicLinksSelected={() => setPublicLinksDlgOpen(true)}
                />
                {!isGridView && (
                    <TableView
                        loading={isLoading}
                        error={error || navError}
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
        </>
    );
}

export default withErrorAnnouncer(Listing);
