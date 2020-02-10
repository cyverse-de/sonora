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

import { camelcaseit } from "../../../common/functions";

function Listing(props) {
    const theme = useTheme();
    let isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    let isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState({ files: [], folders: [] });

    const { baseId, path, handlePathChange } = props;

    useEffect(() => {
        setSelected([]);
    }, [path]);

    useEffect(() => {
        fetch(
            `/api/filesystem/paged-directory?path=${path}&limit=${rowsPerPage}&sort-col=${orderBy}&sort-dir=${order}&offset=${rowsPerPage *
                page}`,
            {
                method: "GET",
                credentials: "include",
            }
        )
            // Do something with errors from terrain.
            .then((resp) => {
                if (resp.status < 200 || resp.status > 299) {
                    throw Error(resp);
                }
                return resp;
            })

            .then((resp) => resp.json())

            // Unify the data listing, adding type info along the way.
            .then(
                (respData) =>
                    [
                        ...respData.folders.map((f) => ({
                            ...f,
                            type: "FOLDER",
                        })),
                        ...respData.files.map((f) => ({ ...f, type: "FILE" })),
                    ].map((i) => camelcaseit(i)) // camelcase the fields for each object, for consistency.
            )

            // Storing the listing here avoids having to regen the
            // list of items on every render pass.
            .then((listing) => setData(listing))

            // We need to figure out a consistent error handler.
            .catch((e) => console.log(`error ${e.message}`));
    }, [path, rowsPerPage, orderBy, order, page]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds = data?.map((resource) => resource.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Simple range select: if you shift-click a range, the range will be
    // selected.  If all items in the range are already selected, all items
    // will be deselected.
    const rangeSelect = (start, end, targetId) => {
        let rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(data[i].id);
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
            <Header
                baseId={baseId}
                isGridView={false}
                onDownloadSelected={onDownloadSelected}
                onEditSelected={onEditSelected}
                onMetadataSelected={onMetadataSelected}
                onDeleteSelected={onDeleteSelected}
            />
            <TableView
                // loading={loading}
                path={path}
                handlePathChange={handlePathChange}
                listing={data}
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data?.length} // will need to change to total
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
}

export default withI18N(Listing, messages);
