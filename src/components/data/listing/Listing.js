/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */
import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import { withI18N } from "@cyverse-de/ui-lib";
import { TablePagination, useMediaQuery, useTheme } from "@material-ui/core";
import gql from "graphql-tag";

import messages from "../messages";
import TableView from "./TableView";

const GET_LISTING = gql`
    query listing($path: String) {
        filesystem(path: $path) {
            id
            path
            label
            dateModified
            permission
            ... on Folder {
                contents {
                    listing {
                        id
                        label
                        path
                        dateModified
                        permission
                        type
                        #                        ... on File {
                        #                            fileSize
                        #                        }
                    }
                }
            }
        }
    }
`;

function Listing(props) {
    const theme = useTheme();
    let isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    let isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("label");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const { baseId, path, handlePathChange } = props;
    useEffect(() => {
        setSelected([]);
    }, [path]);
    const { data, loading } = useQuery(GET_LISTING, {
        variables: { path: path },
    });
    const listing = data?.filesystem?.contents?.listing;

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds = listing?.map((resource) => resource.id) || [];
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
            rangeIds.push(listing[i].id);
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
            <TableView
                loading={loading}
                path={path}
                handlePathChange={handlePathChange}
                listing={listing}
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
                count={listing?.length} // will need to change to total
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
}

export default withI18N(Listing, messages);
