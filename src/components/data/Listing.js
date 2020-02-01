import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import { LoadingMask, withI18N, } from "@cyverse-de/ui-lib";
import { useMediaQuery, useTheme, } from "@material-ui/core";
import gql from "graphql-tag";

import messages from "./messages";
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
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(25);

    const { baseId, path } = props;
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
        if (event.target.checked) {
            const newSelecteds = listing?.map((resource) => resource.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Simple range select: if you shift-click a range, the range will be
    // selected.  If all items in the range are already selected, all items
    // will be deselected.
    const rangeSelect = (start, end) => {
        let rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(listing[i].id);
        }

        let rangeSelected = rangeIds.reduce(
            (acc, id) => acc && selected.includes(id),
            true
        );

        rangeSelected ? deselect(rangeIds) : select(rangeIds);
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex)
                : rangeSelect(lastSelectIndex, index);
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
        let newSelected = [...selected];
        resourceIds.forEach((resourceId) => {
            const selectedIndex = newSelected.indexOf(resourceId);

            if (selectedIndex === 0) {
                newSelected = [...newSelected.slice(1)];
            } else if (selectedIndex === selected.length - 1) {
                newSelected = [...newSelected.slice(0, -1)];
            } else if (selectedIndex > 0) {
                newSelected = [
                    ...newSelected.slice(0, selectedIndex),
                    ...newSelected.slice(selectedIndex + 1),
                ];
            }
        });

        setSelected(newSelected);
    };

    const onDownloadSelected = (resourceId) => {
        console.log("Download", resourceId)
    };

    const onEditSelected = (resourceId) => {
        console.log("Edit", resourceId)
    };

    const onMetadataSelected = (resourceId) => {
        console.log("Metadata", resourceId)
    };

    const onDeleteSelected = (resourceId) => {
        console.log("Delete", resourceId)
    };

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };
    //
    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    return (
        <LoadingMask loading={loading}>
            <TableView
                path={path}
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
        </LoadingMask>
    );
}

export default withI18N(Listing, messages);
