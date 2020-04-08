/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */
import React, { useEffect, useState } from "react";

import { withI18N } from "@cyverse-de/ui-lib";
import { TablePagination, Toolbar } from "@material-ui/core";
import { injectIntl } from "react-intl";

import Header from "../Header";
import messages from "../messages";
import TableView from "./TableView";
import UploadDropTarget from "../../uploads/UploadDropTarget";
import { useUploadTrackingState } from "../../../contexts/uploadTracking";
import { camelcaseit } from "../../../common/functions";
import Drawer from "../details/Drawer";
import { getInfoTypes, getPagedListing } from "../../endpoints/Filesystem";
import DataNavigation from "../DataNavigation";

function Listing(props) {
    const uploadTracker = useUploadTrackingState();

    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({ total: 0, files: [], folders: [] });
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);

    const {
        baseId,
        path,
        handlePathChange,
        multiSelect = true,
        isInvalidSelection = () => false,
        render,
    } = props;

    // Used to force the data listing to refresh when uploads are completed.
    const uploadsCompleted = uploadTracker.uploads.filter((upload) => {
        return (
            upload.parentPath === path &&
            upload.hasUploaded &&
            !upload.hasErrored
        );
    }).length;

    useEffect(() => {
        setSelected([]);
    }, [path]);

    useEffect(() => {
        if (path) {
            setLoading(true);
            getPagedListing(path, rowsPerPage, orderBy, order, page).then(
                (respData) => {
                    respData &&
                        setData({
                            total: respData?.total,
                            listing: [
                                ...respData?.folders.map((f) => ({
                                    ...f,
                                    type: "FOLDER",
                                })),
                                ...respData?.files.map((f) => ({
                                    ...f,
                                    type: "FILE",
                                })),
                            ].map((i) => camelcaseit(i)), // camelcase the fields for each object, for consistency.
                        });
                    setError("");
                    setLoading(false);
                }
            );
        }
    }, [path, rowsPerPage, orderBy, order, page, uploadsCompleted]);

    useEffect(() => {
        getInfoTypes().then((resp) => {
            if (resp) {
                setInfoTypes(resp.types);
            }
        });
    }, []);

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
        const rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(data?.listing[i].id);
        }

        let isTargetSelected = selected.includes(targetId);

        isTargetSelected ? deselect(rangeIds) : select(rangeIds);
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey && multiSelect) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            toggleSelection(id);
        }

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
            let newSelected = [...selected];
            resourceIds.forEach((resourceId) => {
                const selectedIndex = selected.indexOf(resourceId);
                if (selectedIndex === -1) {
                    newSelected.push(resourceId);
                }
            });
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
        console.log("Delete", resourceId);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
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

    const getSelectedResources = () => {
        return selected.map((id) =>
            data?.listing?.find((resource) => resource.id === id)
        );
    };

    return (
        <>
            {render && render(selected.length, getSelectedResources)}
            <UploadDropTarget path={path}>
                <Toolbar variant="dense">
                    <DataNavigation
                        path={path}
                        handlePathChange={handlePathChange}
                        baseId={baseId}
                    />
                </Toolbar>
                <Header
                    baseId={baseId}
                    isGridView={isGridView}
                    toggleDisplay={toggleDisplay}
                    onDownloadSelected={onDownloadSelected}
                    onEditSelected={onEditSelected}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    detailsEnabled={detailsEnabled}
                    onDetailsSelected={onDetailsSelected}
                />
                {!isGridView && (
                    <TableView
                        loading={loading}
                        error={error}
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
                        handleClick={handleClick}
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                    />
                )}
                {isGridView && <span>Coming Soon!</span>}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data?.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
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
        </>
    );
}

export default withI18N(injectIntl(Listing), messages);
