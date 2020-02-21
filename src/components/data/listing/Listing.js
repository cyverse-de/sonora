/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */
import React, { useEffect, useState } from "react";

import { withI18N } from "@cyverse-de/ui-lib";
import { TablePagination, useMediaQuery, useTheme } from "@material-ui/core";

import Header from "../Header";
import messages from "../messages";
import TableView from "./TableView";
import callApi from "../../../common/callApi";
import UploadDropTarget from "./UploadDropTarget";

import { camelcaseit } from "../../../common/functions";

function Listing(props) {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ total: 0, files: [], folders: [] });
    const [uploadsCompleted, setUploadsCompleted] = useState(0);

    const { baseId, path, handlePathChange } = props;

    useEffect(() => {
        setSelected([]);
    }, [path]);

    useEffect(() => {
        callApi({
            endpoint: `/api/filesystem/paged-directory?path=${path}&limit=${rowsPerPage}&sort-col=${orderBy}&sort-dir=${order}&offset=${rowsPerPage *
                page}`,
            setLoading,
        }).then((respData) => {
            respData &&
                setData({
                    total: respData?.total,
                    listing: [
                        ...respData?.folders.map((f) => ({
                            ...f,
                            type: "FOLDER",
                        })),
                        ...respData?.files.map((f) => ({ ...f, type: "FILE" })),
                    ].map((i) => camelcaseit(i)), // camelcase the fields for each object, for consistency.
                });
        });
    }, [path, rowsPerPage, orderBy, order, page, uploadsCompleted]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
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
        if (event.shiftKey) {
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
        let newSelected = [...selected];
        resourceIds.forEach((resourceId) => {
            const selectedIndex = selected.indexOf(resourceId);
            if (selectedIndex === -1) {
                newSelected.push(resourceId);
            }
        });

        setSelected(newSelected);
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

    return (
        <>
            <UploadDropTarget
                path={path}
                uploadCompletedCB={() =>
                    setUploadsCompleted(
                        (uploadsCompleted) => uploadsCompleted + 1 // prevents stale values in closures.
                    )
                }
            >
                <Header
                    baseId={baseId}
                    isGridView={isGridView}
                    toggleDisplay={toggleDisplay}
                    onDownloadSelected={onDownloadSelected}
                    onEditSelected={onEditSelected}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    path={path}
                />

                {!isGridView && (
                    <TableView
                        loading={loading}
                        path={path}
                        handlePathChange={handlePathChange}
                        listing={data?.listing}
                        isMedium={isMedium}
                        isLarge={isLarge}
                        baseId={baseId}
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
        </>
    );
}

export default withI18N(Listing, messages);
