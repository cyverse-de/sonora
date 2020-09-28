/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */

import React, { useCallback, useEffect, useState } from "react";

import TableView from "./TableView";

import ids from "../ids";
import Drawer from "../details/Drawer";
import FileBrowser from "../toolbar/FileBrowser";
import DataToolbar from "../toolbar/Toolbar";
import constants from "../../../constants";

import DEPagination from "components/utils/DEPagination";
import ResourceTypes from "components/models/ResourceTypes";
import isQueryLoading from "components/utils/isQueryLoading";
import URLImportDialog from "components/URLImportDialog";
import UploadDialog from "components/uploads/dialog";
import {
    processSelectedFiles,
    trackUpload,
} from "components/uploads/UploadDrop";
import UploadDropTarget from "components/uploads/UploadDropTarget";
import { camelcaseit } from "common/functions";
import { getLocalStorage } from "components/utils/localStorage";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

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

import { queryCache, useMutation, useQuery } from "react-query";

import { Button, Typography, useTheme } from "@material-ui/core";

function Listing(props) {
    const uploadTracker = useUploadTrackingState();
    const theme = useTheme();
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        getLocalStorage(constants.LOCAL_STORAGE.DATA.PAGE_SIZE) || 100
    );
    const [data, setData] = useState({ total: 0, listing: [] });
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [pagedListingKey, setPagedListingKey] = useState(
        DATA_LISTING_QUERY_KEY
    );
    const [pagedListingQueryEnabled, setPagedListingQueryEnabled] = useState(
        false
    );
    const [navError, setNavError] = useState(null);
    const {
        baseId,
        path,
        handlePathChange,
        multiSelect = true,
        isInvalidSelection = () => false,
        render,
        showErrorAnnouncer,
    } = props;

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
    const { t } = useTranslation("data");

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
        queryKey: pagedListingKey,
        queryFn: getPagedListing,
        config: {
            enabled: pagedListingQueryEnabled,
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
        queryCache.invalidateQueries(pagedListingKey, { force: true });

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
        if (path) {
            setPagedListingKey([
                DATA_LISTING_QUERY_KEY,
                path,
                rowsPerPage,
                orderBy,
                order,
                page,
                uploadsCompleted,
            ]);
            setPagedListingQueryEnabled(true);
        }
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
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
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
        console.log("Metadata", resourceId);
    };

    const onDeleteSelected = (resourceId) => {
        const items = resourceId ? [resourceId] : null;
        const paths = getSelectedResources(items).map(
            (resource) => resource.path
        );
        removeResources({ paths });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setPage(0);
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

    const getSelectedResources = (resources) => {
        const items = resources ? resources : selected;
        return items.map((id) =>
            data?.listing?.find((resource) => resource.id === id)
        );
    };

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
                    handlePathChange={handlePathChange}
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
                    handleDataNavError={handleDataNavError}
                    baseId={baseId}
                    setUploadDialogOpen={setUploadDialogOpen}
                    setImportDialogOpen={setImportDialogOpen}
                    localUploadId={localUploadId}
                    uploadMenuId={build(baseId, ids.TOOLBAR, ids.UPLOAD_MENU)}
                />
                {!isGridView && (
                    <TableView
                        loading={isLoading}
                        error={error || navError}
                        path={path}
                        permission={data?.permission}
                        handlePathChange={handlePathChange}
                        listing={data?.listing}
                        baseId={baseId}
                        detailsEnabled={detailsEnabled}
                        isInvalidSelection={isInvalidSelection}
                        onDownloadSelected={onDownloadSelected}
                        onEditSelected={onEditSelected}
                        onMetadataSelected={onMetadataSelected}
                        onDeleteSelected={onDeleteSelected}
                        handleRequestSort={handleRequestSort}
                        handleSelectAllClick={handleSelectAllClick}
                        handleCheckboxClick={handleCheckboxClick}
                        onDetailsSelected={onDetailsSelected}
                        handleClick={handleClick}
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        setUploadDialogOpen={setUploadDialogOpen}
                        setImportDialogOpen={setImportDialogOpen}
                        localUploadId={localUploadId}
                        uploadMenuId={build(
                            baseId,
                            ids.LISTING_TABLE,
                            ids.UPLOAD_MENU
                        )}
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
        </>
    );
}

export default withErrorAnnouncer(Listing);
