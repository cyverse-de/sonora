/**
 * @author aramsey
 *
 * A component intended for showing a data listing in a table format.
 */

import React from "react";

import {
    build,
    DECheckbox,
    DETableRow,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
} from "@material-ui/core";

import DataDotMenu from "./DataDotMenu";
import { getFileSize } from "./FileSize";
import ids from "../ids";
import messages from "../messages";
import ResourceIcon from "./ResourceIcon";
import styles from "../styles";
import TableLoading from "./TableLoading";

const useStyles = makeStyles(styles);

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

function TableView(props) {
    const {
        loading,
        path,
        PathLink,
        listing,
        isMedium,
        isLarge,
        baseId,
        onDownloadSelected,
        onEditSelected,
        onMetadataSelected,
        onDeleteSelected,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        order,
        orderBy,
        selected,
    } = props;

    const tableId = build(baseId, ids.listingTable);
    const tableColumns = getTableColumns(isMedium, isLarge);
    const classes = useStyles();

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
                {loading && (
                    <TableLoading
                        numColumns={tableColumns.length}
                        numRows={25}
                    />
                )}
                {!loading && (
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
                                            handleClick(
                                                event,
                                                resourceId,
                                                index
                                            )
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
                                            <ResourceIcon
                                                type={resource.type}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <PathLink
                                                path={`${path}/${resource.label}`}
                                            >
                                                <span
                                                    className={classes.dataLink}
                                                >
                                                    {resource.label}
                                                </span>
                                            </PathLink>
                                        </TableCell>
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
                                            <TableCell>
                                                {resource.path}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <DataDotMenu
                                                baseId={tableId}
                                                onDownloadSelected={() =>
                                                    onDownloadSelected(
                                                        resourceId
                                                    )
                                                }
                                                onEditSelected={() =>
                                                    onEditSelected(resourceId)
                                                }
                                                onMetadataSelected={() =>
                                                    onMetadataSelected(
                                                        resourceId
                                                    )
                                                }
                                                onDeleteSelected={() =>
                                                    onDeleteSelected(resourceId)
                                                }
                                            />
                                        </TableCell>
                                    </DETableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(TableView, messages);
