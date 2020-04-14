/**
 * @author aramsey
 *
 * A component intended for showing a data listing in a table format.
 */

import React, { Fragment, useState } from "react";

import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    fade,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@material-ui/core";
import { injectIntl } from "react-intl";

import CustomizeColumns from "./CustomizeColumns";
import DataDotMenu from "./DataDotMenu";
import { getFileSize } from "./FileSize";
import ids from "../ids";
import messages from "../messages";
import ResourceIcon from "./ResourceIcon";
import SpanLink from "./SpanLink";
import TableLoading from "../../utils/TableLoading";

const COL_KEYS = {
    CHECKBOX: "checkbox",
    DOT_MENU: "dotMenu",
    NAME: "name",
    SIZE: "size",
    LAST_MODIFIED: "datemodified",
    INFO_TYPE: "infoType",
    PERMISSION: "permission",
    CREATED: "datecreated",
    PATH: "path",
};

function SizeCell({ resource }) {
    return <TableCell>{getFileSize(resource.fileSize)}</TableCell>;
}

function ModifiedCell({ resource }) {
    return (
        <TableCell>
            {formatDate(resource.dateModified, "YYYY MMM DD HH:mm:ss")}
        </TableCell>
    );
}

function InfoTypeCell({ resource }) {
    return <TableCell>{resource.infoType}</TableCell>;
}

function PermissionCell({ resource }) {
    return <TableCell>{resource.permission}</TableCell>;
}

function CreatedCell({ resource }) {
    return (
        <TableCell>
            {formatDate(resource.dateCreated, "YYYY MMM DD HH:mm:ss")}
        </TableCell>
    );
}

function PathCell({ resource }) {
    return <TableCell>{resource.path}</TableCell>;
}

function getColumnCell(key, resource) {
    switch (key) {
        case COL_KEYS.SIZE:
            return <SizeCell resource={resource} />;
        case COL_KEYS.LAST_MODIFIED:
            return <ModifiedCell resource={resource} />;
        case COL_KEYS.CREATED:
            return <CreatedCell resource={resource} />;
        case COL_KEYS.PATH:
            return <PathCell resource={resource} />;
        case COL_KEYS.PERMISSION:
            return <PermissionCell resource={resource} />;
        case COL_KEYS.INFO_TYPE:
            return <InfoTypeCell resource={resource} />;
        default:
            return null;
    }
}

// Copied from MUI's TableRow code, changed the selected color to error intention
const invalidRowStyles = makeStyles((theme) => ({
    root: {
        "&$selected, &$selected:hover": {
            backgroundColor: fade(
                theme.palette.error.main,
                theme.palette.action.selectedOpacity
            ),
        },
    },
    /* Pseudo-class applied to the root element if `selected={true}`. */
    selected: {},
    /* Pseudo-class applied to the root element if `hover={true}`. */
    hover: {},
}));

function TableView(props) {
    const {
        loading,
        path,
        error,
        handlePathChange,
        listing,
        baseId,
        isInvalidSelection = () => false,
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
        intl,
    } = props;
    const invalidRowClass = invalidRowStyles();

    const tableId = build(baseId, ids.listingTable);
    const [displayColumns, setDisplayColumns] = useState([
        COL_KEYS.CHECKBOX,
        COL_KEYS.NAME,
        COL_KEYS.DOT_MENU,
    ]);

    const optionalColumns = () => {
        return [
            {
                name: "Last Modified",
                align: "left",
                enableSorting: true,
                key: COL_KEYS.LAST_MODIFIED,
                id: COL_KEYS.LAST_MODIFIED,
            },
            {
                name: "Date Submitted",
                align: "left",
                enableSorting: true,
                key: COL_KEYS.CREATED,
                id: COL_KEYS.CREATED,
            },
            {
                name: "Size",
                align: "left",
                enableSorting: true,
                key: COL_KEYS.SIZE,
                id: COL_KEYS.SIZE,
            },
            {
                name: "Info Type",
                align: "left",
                enableSorting: false,
                key: COL_KEYS.INFO_TYPE,
                id: COL_KEYS.INFO_TYPE,
            },
            {
                name: "Permission",
                align: "left",
                enableSorting: false,
                key: COL_KEYS.PERMISSION,
                id: COL_KEYS.PERMISSION,
            },
            {
                name: "Path",
                align: "left",
                enableSorting: true,
                key: COL_KEYS.PATH,
                id: COL_KEYS.PATH,
            },
        ];
    };

    const getTableColumns = () => {
        return [
            {
                name: "",
                align: "center",
                enableSorting: false,
                key: COL_KEYS.CHECKBOX,
                id: COL_KEYS.CHECKBOX,
            },
            {
                name: "Name",
                align: "left",
                enableSorting: true,
                key: COL_KEYS.NAME,
                id: COL_KEYS.NAME,
            },
            ...optionalColumns(),
            {
                name: (
                    <CustomizeColumns
                        baseId={tableId}
                        allTableColumns={optionalColumns()}
                        displayColumns={displayColumns}
                        setDisplayColumns={setDisplayColumns}
                    />
                ),
                align: "left",
                enableSorting: false,
                key: COL_KEYS.DOT_MENU,
                id: COL_KEYS.DOT_MENU,
            },
        ];
    };

    const getColumnDetails = (keys) => {
        return keys.map((key) =>
            getTableColumns().find((col) => col.key === key)
        );
    };

    return (
        <TableContainer
            component={Paper}
            style={{
                height: "60vh",
            }}
        >
            <Table
                stickyHeader
                size="small"
                id={tableId}
                aria-label={formatMessage(intl, "ariaTableListing", {
                    path: path,
                })}
            >
                <EnhancedTableHead
                    selectable={true}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowsInPage={listing?.length}
                    order={order}
                    orderBy={orderBy}
                    baseId={tableId}
                    columnData={getColumnDetails(displayColumns)}
                    onRequestSort={handleRequestSort}
                />
                {loading && (
                    <TableBody>
                        <TableLoading
                            numColumns={displayColumns.length}
                            numRows={25}
                        />
                    </TableBody>
                )}
                {!loading && (
                    <TableBody>
                        {(!listing || listing.length === 0) && !error && (
                            <EmptyTable
                                message={getMessage("emptyDataListing")}
                                numColumns={displayColumns.length + 1} // extra for checkbox col
                            />
                        )}
                        {error && (
                            <EmptyTable
                                message={error.toString()}
                                numColumns={displayColumns.length}
                            />
                        )}
                        {listing &&
                            listing.length > 0 &&
                            listing.map((resource, index) => {
                                const resourceName = resource.label;
                                const resourceId = resource.id;
                                const isSelected =
                                    selected.indexOf(resourceId) !== -1;
                                const isInvalid =
                                    isSelected && isInvalidSelection(resource);
                                return (
                                    <TableRow
                                        classes={
                                            isInvalid ? invalidRowClass : null
                                        }
                                        title={
                                            isInvalid
                                                ? formatMessage(
                                                      intl,
                                                      "invalidSelectionRowTitle"
                                                  )
                                                : null
                                        }
                                        aria-label={
                                            isInvalid
                                                ? formatMessage(
                                                      intl,
                                                      "invalidSelectionRowTitle"
                                                  )
                                                : null
                                        }
                                        role="checkbox"
                                        tabIndex={0}
                                        hover
                                        id={build(tableId, resourceName)}
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
                                                tabIndex={0}
                                                id={build(
                                                    tableId,
                                                    resourceName,
                                                    ids.checkbox
                                                )}
                                                inputProps={{
                                                    "aria-label": formatMessage(
                                                        intl,
                                                        "ariaCheckbox",
                                                        {
                                                            label:
                                                                resource.label,
                                                        }
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
                                            <SpanLink
                                                id={build(
                                                    tableId,
                                                    resourceName,
                                                    ids.navLink
                                                )}
                                                onClick={() =>
                                                    handlePathChange(
                                                        `${path}/${resource.label}`
                                                    )
                                                }
                                            >
                                                {resource.label}
                                            </SpanLink>
                                        </TableCell>
                                        {getColumnDetails(displayColumns).map(
                                            (column, index) => (
                                                <Fragment key={index}>
                                                    {getColumnCell(
                                                        column.key,
                                                        resource
                                                    )}
                                                </Fragment>
                                            )
                                        )}
                                        <TableCell>
                                            <DataDotMenu
                                                baseId={build(
                                                    tableId,
                                                    resourceName
                                                )}
                                                MenuProps={{ tabIndex: 0 }}
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
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
