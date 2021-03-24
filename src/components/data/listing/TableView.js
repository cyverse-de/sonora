/**
 * @author aramsey
 *
 * A component intended for showing a data listing in a table format.
 */

import React, { Fragment, useState } from "react";
import { useTranslation } from "i18n";
import CustomizeColumns from "./CustomizeColumns";
import dataFields from "../dataFields";
import ResourceIcon from "./ResourceIcon";
import SpanLink from "./SpanLink";
import { getFileSize } from "./FileSize";

import ids from "../ids";

import TableLoading from "../../utils/TableLoading";
import constants from "../../../constants";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";
import { DERow } from "components/utils/DERow";
import DETableHead from "components/utils/DETableHead";
import { isPathInTrash } from "../utils";
import { useConfig } from "contexts/config";

import { build, DECheckbox, EmptyTable, formatDate } from "@cyverse-de/ui-lib";
import { defaultInstantLaunch } from "serviceFacades/instantlaunches";

import {
    fade,
    makeStyles,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
} from "@material-ui/core";

import { Launch as LaunchIcon } from "@material-ui/icons";

import RowDotMenu from "./RowDotMenu";

function SizeCell({ resource }) {
    return <TableCell>{getFileSize(resource.fileSize)}</TableCell>;
}

function ModifiedCell({ resource }) {
    return <TableCell>{formatDate(resource.dateModified)}</TableCell>;
}

function InfoTypeCell({ resource }) {
    return <TableCell>{resource.infoType}</TableCell>;
}

function PermissionCell({ resource }) {
    return <TableCell>{resource.permission}</TableCell>;
}

function CreatedCell({ resource }) {
    return <TableCell>{formatDate(resource.dateCreated)}</TableCell>;
}

function PathCell({ resource }) {
    return <TableCell>{resource.path}</TableCell>;
}

function getColumnCell(key, resource, dataRecordFields) {
    switch (key) {
        case dataRecordFields.SIZE.key:
            return <SizeCell resource={resource} />;
        case dataRecordFields.LAST_MODIFIED.key:
            return <ModifiedCell resource={resource} />;
        case dataRecordFields.CREATED.key:
            return <CreatedCell resource={resource} />;
        case dataRecordFields.PATH.key:
            return <PathCell resource={resource} />;
        case dataRecordFields.PERMISSION.key:
            return <PermissionCell resource={resource} />;
        case dataRecordFields.INFO_TYPE.key:
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

function getDefaultCols(rowDotMenuVisibility, dataRecordFields) {
    const defCols = [dataRecordFields.CHECKBOX.key, dataRecordFields.NAME.key];
    if (rowDotMenuVisibility) {
        defCols.push(dataRecordFields.DOT_MENU.key);
    }
    return defCols;
}

function getLocalStorageCols(rowDotMenuVisibility, dataRecordFields) {
    let localCols = getLocalStorage(constants.LOCAL_STORAGE.DATA.COLUMNS);
    if (!rowDotMenuVisibility && localCols) {
        return localCols.filter((key) => key !== dataRecordFields.DOT_MENU.key);
    }
    return localCols;
}

function setLocalStorageCols(columns) {
    setLocalStorage(constants.LOCAL_STORAGE.DATA.COLUMNS, columns);
}

function TableView(props) {
    const {
        loading,
        path,
        error,
        handlePathChange,
        listing,
        baseId,
        isInvalidSelection = () => false,
        onDetailsSelected,
        onDeleteSelected,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleCheckboxClick,
        order,
        orderBy,
        selected,
        setSharingDlgOpen,
        onMetadataSelected,
        onPublicLinksSelected,
        rowDotMenuVisibility,
        onDownloadSelected,
        onRenameSelected,
        instantLaunchDefaultsMapping,
    } = props;

    const invalidRowClass = invalidRowStyles();
    const { t } = useTranslation("data");
    const dataRecordFields = dataFields(t);
    const tableId = build(baseId, ids.LISTING_TABLE);
    const [config] = useConfig();

    const [displayColumns, setDisplayColumns] = useState(
        getLocalStorageCols(rowDotMenuVisibility, dataRecordFields) ||
            getDefaultCols(rowDotMenuVisibility, dataRecordFields)
    );

    const onSetDisplayColumns = (columns) => {
        setLocalStorageCols(columns);
        setDisplayColumns(columns);
    };

    const inTrash = isPathInTrash(path, config?.irods?.trash_path);

    const optionalColumns = () => {
        return [
            {
                name: dataRecordFields.LAST_MODIFIED.fieldName,
                align: "left",
                enableSorting: true,
                key: dataRecordFields.LAST_MODIFIED.key,
                id: dataRecordFields.LAST_MODIFIED.key,
            },
            {
                name: dataRecordFields.CREATED.fieldName,
                align: "left",
                enableSorting: true,
                key: dataRecordFields.CREATED.key,
                id: dataRecordFields.CREATED.key,
            },
            {
                name: dataRecordFields.SIZE.fieldName,
                align: "left",
                enableSorting: true,
                key: dataRecordFields.SIZE.key,
                id: dataRecordFields.SIZE.key,
            },
            {
                name: dataRecordFields.INFO_TYPE.fieldName,
                align: "left",
                enableSorting: false,
                key: dataRecordFields.INFO_TYPE.key,
                id: dataRecordFields.INFO_TYPE.key,
            },
            {
                name: dataRecordFields.PERMISSION.fieldName,
                align: "left",
                enableSorting: false,
                key: dataRecordFields.PERMISSION.key,
                id: dataRecordFields.PERMISSION.key,
            },
            {
                name: dataRecordFields.PATH.fieldName,
                align: "left",
                enableSorting: true,
                key: dataRecordFields.PATH.key,
                id: dataRecordFields.PATH.key,
            },
        ];
    };

    const getTableColumns = () => {
        const cols = [
            {
                name: "",
                align: "center",
                enableSorting: false,
                key: dataRecordFields.CHECKBOX.key,
                id: dataRecordFields.CHECKBOX.key,
            },
            {
                name: dataRecordFields.NAME.fieldName,
                align: "left",
                enableSorting: true,
                key: dataRecordFields.NAME.key,
                id: dataRecordFields.NAME.key,
            },
            ...optionalColumns(),
        ];
        if (rowDotMenuVisibility) {
            cols.push({
                name: (
                    <CustomizeColumns
                        baseId={tableId}
                        allTableColumns={optionalColumns()}
                        displayColumns={displayColumns}
                        setDisplayColumns={onSetDisplayColumns}
                    />
                ),
                align: "right",
                enableSorting: false,
                key: dataRecordFields.DOT_MENU.key,
                id: dataRecordFields.DOT_MENU.key,
            });
        }
        return cols;
    };

    const getColumnDetails = (keys) => {
        return keys.map((key) =>
            getTableColumns().find((col) => col.key === key)
        );
    };

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                stickyHeader
                size="small"
                id={tableId}
                aria-label={t("ariaTableListing", {
                    path: path,
                })}
            >
                <DETableHead
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
                    <TableLoading
                        baseId={tableId}
                        numColumns={displayColumns.length}
                        numRows={25}
                    />
                )}
                {!loading && (
                    <TableBody>
                        {(!listing || listing.length === 0) && !error && (
                            <EmptyTable
                                message={t("emptyDataListing")}
                                numColumns={displayColumns.length + 1} // extra for checkbox col
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
                                const [
                                    instantLaunch,
                                    instantLaunchName,
                                ] = defaultInstantLaunch(
                                    instantLaunchDefaultsMapping,
                                    resource
                                );
                                return (
                                    <DERow
                                        classes={
                                            isInvalid ? invalidRowClass : null
                                        }
                                        title={
                                            isInvalid
                                                ? t("invalidSelectionRowTitle")
                                                : null
                                        }
                                        aria-label={
                                            isInvalid
                                                ? t("invalidSelectionRowTitle")
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
                                                onChange={(event) =>
                                                    handleCheckboxClick(
                                                        event,
                                                        resourceId,
                                                        index
                                                    )
                                                }
                                                inputProps={{
                                                    "aria-label": t(
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
                                                onClick={() => {
                                                    handlePathChange(
                                                        `${path}/${resource.label}`,
                                                        resource.type,
                                                        resource.id
                                                    );
                                                }}
                                            >
                                                {resource.label}
                                            </SpanLink>
                                        </TableCell>
                                        {getColumnDetails(displayColumns).map(
                                            (column, index) => (
                                                <Fragment key={index}>
                                                    {getColumnCell(
                                                        column.key,
                                                        resource,
                                                        dataRecordFields
                                                    )}
                                                </Fragment>
                                            )
                                        )}

                                        {rowDotMenuVisibility && (
                                            <TableCell align="right">
                                                {instantLaunch && (
                                                    <IconButton
                                                        variant="contained"
                                                        onClick={() =>
                                                            alert(
                                                                instantLaunchName
                                                            )
                                                        }
                                                    >
                                                        <LaunchIcon />
                                                    </IconButton>
                                                )}
                                                <RowDotMenu
                                                    baseId={build(
                                                        tableId,
                                                        resourceName
                                                    )}
                                                    onDetailsSelected={
                                                        onDetailsSelected
                                                    }
                                                    onDeleteSelected={() =>
                                                        onDeleteSelected(
                                                            resourceId
                                                        )
                                                    }
                                                    resource={resource}
                                                    setSharingDlgOpen={
                                                        setSharingDlgOpen
                                                    }
                                                    onMetadataSelected={
                                                        onMetadataSelected
                                                    }
                                                    onPublicLinksSelected={
                                                        onPublicLinksSelected
                                                    }
                                                    onDownloadSelected={
                                                        onDownloadSelected
                                                    }
                                                    inTrash={inTrash}
                                                    onRenameSelected={
                                                        onRenameSelected
                                                    }
                                                />
                                            </TableCell>
                                        )}
                                    </DERow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default TableView;
