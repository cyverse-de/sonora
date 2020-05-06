/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */
import React, { useCallback, useEffect, useState } from "react";

import { Button, Typography, useTheme } from "@material-ui/core";
import {
    announce,
    AnnouncerConstants,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import { injectIntl } from "react-intl";
import { queryCache, useMutation, useQuery } from "react-query";
import messages from "../messages";
import TableView from "./TableView";
import UploadDropTarget from "../../uploads/UploadDropTarget";
import { useUploadTrackingState } from "../../../contexts/uploadTracking";
import { camelcaseit } from "../../../common/functions";
import Drawer from "../details/Drawer";
import {
    deleteResources,
    getInfoTypes,
    getPagedListing,
} from "../../../serviceFacades/filesystem";
import DataNavigation from "../DataNavigation";
import DEPagination from "../../utils/DEPagination";
import ResourceTypes from "../../models/ResourceTypes";
import isQueryLoading from "../../utils/isQueryLoading";
import DEErrorDialog from "../../utils/error/DEErrorDialog";

function Listing(props) {
    const uploadTracker = useUploadTrackingState();
    const theme = useTheme();
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState({ total: 0, listing: [] });
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [pagedListingKey, setPagedListingKey] = useState(null);
    const [navError, setNavError] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);
    const {
        baseId,
        path,
        handlePathChange,
        multiSelect = true,
        isInvalidSelection = () => false,
        render,
        intl,
    } = props;

    // Used to force the data listing to refresh when uploads are completed.
    const uploadsCompleted = uploadTracker.uploads.filter((upload) => {
        return (
            upload.parentPath === path &&
            upload.hasUploaded &&
            !upload.hasErrored
        );
    }).length;

    const viewErrorDetails = useCallback(() => {
        return (
            <Button variant="outlined" onClick={() => setErrorDialogOpen(true)}>
                <Typography
                    variant="button"
                    style={{ color: theme.palette.error.contrastText }}
                >
                    {formatMessage(intl, "details")}
                </Typography>
            </Button>
        );
    }, [intl, theme.palette.error.contrastText]);

    const { error, isFetching } = useQuery({
        queryKey: pagedListingKey,
        queryFn: getPagedListing,
        config: {
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
        queryCache.refetchQueries(pagedListingKey, { force: true });

    const [removeResources, { status: removeResourceStatus }] = useMutation(
        deleteResources,
        {
            onSuccess: () => refreshListing(),
            onError: (e) => {
                setErrorObject(e);
                announce({
                    text: formatMessage(intl, "deleteResourceError"),
                    variant: AnnouncerConstants.ERROR,
                    CustomAction: viewErrorDetails,
                });
            },
        }
    );

    useEffect(() => {
        setSelected([]);
        if (path) {
            setPagedListingKey([
                "dataPagedListing",
                path,
                rowsPerPage,
                orderBy,
                order,
                page,
                uploadsCompleted,
            ]);
        }
    }, [path, rowsPerPage, orderBy, order, page, uploadsCompleted]);

    useQuery({
        queryKey: "dataFetchInfoTypes",
        queryFn: getInfoTypes,
        config: {
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                setErrorObject(e);
                announce({
                    text: formatMessage(intl, "infoTypeFetchError"),
                    variant: AnnouncerConstants.ERROR,
                    CustomAction: viewErrorDetails,
                });
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

    return (
        <>
            {render && render(selected.length, getSelectedResources)}
            <UploadDropTarget path={path}>
                <DataNavigation
                    path={path}
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
                />
                {!isGridView && (
                    <TableView
                        loading={isLoading}
                        error={error || navError}
                        path={path}
                        handlePathChange={handlePathChange}
                        listing={data?.listing}
                        baseId={baseId}
                        isInvalidSelection={isInvalidSelection}
                        onDownloadSelected={onDownloadSelected}
                        onEditSelected={onEditSelected}
                        onMetadataSelected={onMetadataSelected}
                        onDeleteSelected={onDeleteSelected}
                        handleRequestSort={handleRequestSort}
                        handleSelectAllClick={handleSelectAllClick}
                        handleDataNavError={handleDataNavError}
                        handleClick={handleClick}
                        handleCheckboxClick={handleCheckboxClick}
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
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
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={baseId}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                    setErrorObject(null);
                }}
            />
        </>
    );
}

export default withI18N(injectIntl(Listing), messages);
