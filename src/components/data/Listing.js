import React, { useState } from "react";

import {
    build,
    DECheckbox,
    DETableRow,
    DotMenu,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    GetApp as DownloadIcon,
    Label as MetadataIcon,
} from "@material-ui/icons";

import ids from "./ids";
import messages from "./messages";
import ResourceIcon from "./ResourceIcon";
import { getFileSize } from "./FileSize";

function getTableColumns(isMedium, isLarge) {
    let columns = [
        { name: "", align: "center", enableSorting: false, key: "icon" },
        { name: "Name", align: "left", enableSorting: true },
    ];

    if (isMedium) {
        columns.push(
            {
                name: "Last Modified",
                align: "left",
                enableSorting: false,
                key: "creator",
            },
            { name: "Size", align: "left", enableSorting: false }
        );
    }

    if (isLarge) {
        columns.push({ name: "Path", align: "left", enableSorting: false });
    }

    columns.push({ name: "", align: "left", enableSorting: false });

    return columns;
}

function Listing(props) {
    const theme = useTheme();
    let isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    let isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const tableColumns = getTableColumns(isMedium, isLarge);

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(tableColumns[0].name);
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(25);

    const { data, baseId } = props;
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

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };
    //
    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    let tableId = build(baseId, ids.listingTable);

    return (
        <TableContainer component={Paper}>
            <Table
                stickyHeader
                id={tableId}
                aria-label={getMessage("ariaTableListing")}
            >
                <EnhancedTableHead
                    selectable={true}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowsInPage={listing?.length}
                    order={order}
                    orderBy={orderBy}
                    baseId={tableId}
                    columnData={tableColumns}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {(!listing || listing.length === 0) && (
                        <EmptyTable
                            message={getMessage("emptyDataListing")}
                            numColumns={tableColumns.length}
                        />
                    )}
                    {listing &&
                        listing.length > 0 &&
                        listing.map((resource, index) => {
                            const resourceId = resource.id;
                            const isSelected =
                                selected.indexOf(resourceId) !== -1;
                            return (
                                <DETableRow
                                    role="checkbox"
                                    tabIndex={-1}
                                    hover
                                    id={build(tableId, resourceId)}
                                    key={resourceId}
                                    selected={isSelected}
                                    aria-checked={isSelected}
                                    onClick={(event) =>
                                        handleClick(event, resourceId, index)
                                    }
                                >
                                    <TableCell padding="checkbox">
                                        <DECheckbox
                                            checked={isSelected}
                                            inputProps={{
                                                "aria-labelledby": build(
                                                    tableId,
                                                    resourceId
                                                ),
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <ResourceIcon type={resource.type} />
                                    </TableCell>
                                    <TableCell>{resource.label}</TableCell>
                                    {isMedium && (
                                        <TableCell>
                                            {formatDate(
                                                resource.dateModified,
                                                "YYYY MMM DD HH:mm:ss"
                                            )}
                                        </TableCell>
                                    )}
                                    {isMedium && (
                                        <TableCell>
                                            {getFileSize(resource.fileSize)}
                                        </TableCell>
                                    )}
                                    {isLarge && (
                                        <TableCell>{resource.path}</TableCell>
                                    )}
                                    <TableCell>
                                        <DotMenu
                                            baseId="test"
                                            ButtonProps={{ size: "small" }}
                                            render={(onClose) => [
                                                <MenuItem
                                                    onClick={(event) => {
                                                        onClose(event);
                                                        console.log("Download");
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <DownloadIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={getMessage(
                                                            "download"
                                                        )}
                                                    />
                                                </MenuItem>,
                                                <MenuItem
                                                    onClick={() => {
                                                        onClose();
                                                        console.log("Edit");
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <EditIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={getMessage(
                                                            "editFile"
                                                        )}
                                                    />
                                                </MenuItem>,
                                                <MenuItem
                                                    onClick={() => {
                                                        onClose();
                                                        console.log("Metadata");
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <MetadataIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={getMessage(
                                                            "metadata"
                                                        )}
                                                    />
                                                </MenuItem>,
                                                <MenuItem
                                                    onClick={() => {
                                                        onClose();
                                                        console.log("Delete");
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <DeleteIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={getMessage(
                                                            "delete"
                                                        )}
                                                    />
                                                </MenuItem>,
                                            ]}
                                        />
                                    </TableCell>
                                </DETableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default withI18N(Listing, messages);
