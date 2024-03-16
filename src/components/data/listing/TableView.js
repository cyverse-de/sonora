/**
 * @author aramsey, psarando
 *
 * A component intended for showing a data listing in a table format.
 */

import React, { Fragment, useState } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";
import CustomizeColumns from "./CustomizeColumns";
import dataFields from "../dataFields";
import ResourceIcon from "./ResourceIcon";
import SpanLink from "./SpanLink";

import ids from "../ids";

import TableLoading from "../../table/TableLoading";
import constants from "../../../constants";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import WrappedErrorHandler from "../../error/WrappedErrorHandler";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import { isPathInTrash, formatFileSize, useBaseTrashPath } from "../utils";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";
import EmptyTable from "components/table/EmptyTable";
import { formatDate } from "components/utils/DateFormatter";

import LocalContextsLabelDisplay from "components/metadata/LocalContextsLabelDisplay";
import {
    LocalContextsAttrs,
    parseProjectID,
} from "components/models/metadata/LocalContexts";
import ResourceTypes from "components/models/ResourceTypes";

import InstantLaunchButton from "components/instantlaunches";
import { defaultInstantLaunch } from "serviceFacades/instantlaunches";

import {
    FILESYSTEM_METADATA_QUERY_KEY,
    getFilesystemMetadata,
    getLocalContextsProject,
    LOCAL_CONTEXTS_QUERY_KEY,
} from "serviceFacades/metadata";

import {
    alpha,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    useTheme,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import RowDotMenu from "./RowDotMenu";

function ResourceNameCell({
    rowId,
    resource,
    instantLaunch,
    computeLimitExceeded,
    handlePathChange,
}) {
    const theme = useTheme();
    const [localContextsProjectURI, setLocalContextsProjectURI] = useState();

    const resourceId = resource.id;
    const isFolder = resource.type === ResourceTypes.FOLDER;

    useQuery({
        queryKey: [FILESYSTEM_METADATA_QUERY_KEY, { dataId: resourceId }],
        queryFn: () => getFilesystemMetadata({ dataId: resourceId }),
        enabled: resourceId && isFolder,
        onSuccess: (metadata) => {
            const { avus } = metadata;

            const rightsURI = avus
                ?.find((avu) => avu.attr === LocalContextsAttrs.LOCAL_CONTEXTS)
                ?.avus?.find(
                    (childAVU) =>
                        childAVU.attr === LocalContextsAttrs.RIGHTS_URI
                )?.value;

            if (rightsURI) {
                setLocalContextsProjectURI(rightsURI);
            }
        },
        onError: (error) =>
            console.log(
                "Unable to fetch metadata for folder " + resource.label,
                error
            ), // fail silently.
    });

    const projectID = parseProjectID(localContextsProjectURI);

    const { data: project } = useQuery({
        queryKey: [LOCAL_CONTEXTS_QUERY_KEY, projectID],
        queryFn: () => getLocalContextsProject({ projectID }),
        enabled: !!localContextsProjectURI,
        onError: (error) =>
            console.log("Error fetching Local Contexts project.", {
                localContextsProjectURI,
                error,
            }), // fail silently.
    });

    return (
        <TableCell>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={{ xs: 1, sm: 2 }}
                useFlexGap
                flexWrap="wrap"
            >
                <SpanLink
                    id={buildID(rowId, ids.navLink)}
                    onClick={() => {
                        handlePathChange(
                            resource.path,
                            resource.type,
                            resourceId
                        );
                    }}
                >
                    {resource.label}
                </SpanLink>
                {localContextsProjectURI && project && (
                    <LocalContextsLabelDisplay size="small" project={project} />
                )}

                {instantLaunch && (
                    <InstantLaunchButton
                        instantLaunch={instantLaunch}
                        resource={resource}
                        size="small"
                        color="default"
                        style={{
                            marginLeft: theme.spacing(3),
                        }}
                        computeLimitExceeded={computeLimitExceeded}
                    />
                )}
            </Stack>
        </TableCell>
    );
}

function SizeCell({ resource }) {
    return <TableCell>{formatFileSize(resource.fileSize)}</TableCell>;
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
const invalidRowStyles = makeStyles()((theme, _params, classes) => ({
    root: {
        [`&.${classes.selected}, &.${classes.selected}:hover`]: {
            backgroundColor: alpha(
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
    const defCols = [
        dataRecordFields.CHECKBOX.key,
        dataRecordFields.NAME.key,
        dataRecordFields.LAST_MODIFIED.key,
        dataRecordFields.SIZE.key,
    ];
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
        onMoveSelected,
        instantLaunchDefaultsMapping,
        computeLimitExceeded,
    } = props;

    const { classes: invalidRowClass } = invalidRowStyles();
    const { t } = useTranslation("data");
    const dataRecordFields = dataFields(t);
    const tableId = buildID(baseId, ids.LISTING_TABLE);
    const trashPath = useBaseTrashPath();

    const [displayColumns, setDisplayColumns] = useState(
        getLocalStorageCols(rowDotMenuVisibility, dataRecordFields) ||
            getDefaultCols(rowDotMenuVisibility, dataRecordFields)
    );

    const onSetDisplayColumns = (columns) => {
        setLocalStorageCols(columns);
        setDisplayColumns(columns);
    };

    const inTrash = isPathInTrash(path, trashPath);

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
                                const rowId = buildID(tableId, resourceName);

                                const isSelected =
                                    selected.indexOf(resourceId) !== -1;
                                const isInvalid =
                                    isSelected && isInvalidSelection(resource);
                                const [instantLaunch] = defaultInstantLaunch(
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
                                        id={rowId}
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
                                                id={buildID(
                                                    rowId,
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
                                                            label: resource.label,
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
                                        <ResourceNameCell
                                            rowId={rowId}
                                            resource={resource}
                                            instantLaunch={instantLaunch}
                                            computeLimitExceeded={
                                                computeLimitExceeded
                                            }
                                            handlePathChange={handlePathChange}
                                        />
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
                                                <RowDotMenu
                                                    baseId={rowId}
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
                                                    onMoveSelected={
                                                        onMoveSelected
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
