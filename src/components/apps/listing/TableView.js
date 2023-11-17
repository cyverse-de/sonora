/**
 * @author sriram
 *
 * A tabular view of apps
 *
 */

import React from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";
import EmptyTable from "components/table/EmptyTable";
import PageWrapper from "components/layout/PageWrapper";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
} from "@mui/material";

import ids from "../ids";
import RowDotMenu from "./RowDotMenu";

import AppStatusIcon from "../AppStatusIcon";
import AppName from "../AppName";
import appFields from "../appFields";

import { getAppTypeDisplay } from "components/apps/utils";

import { AppActionCell } from "components/search/detailed/AppSearchResults";
import DETableHead from "components/table/DETableHead";
import TableLoading from "components/table/TableLoading";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import { DERow } from "components/table/DERow";
import DeleteButton from "components/utils/DeleteButton";

function getTableColumns(enableDelete, enableMenu, enableActionCell, t) {
    const fields = appFields(t);
    let tableColumns = [
        {
            name: "",
            numeric: false,
            enableSorting: false,
            key: fields.STATUS.key,
            id: fields.STATUS.key,
        },

        {
            name: fields.NAME.fieldName,
            enableSorting: true,
            key: fields.NAME.key,
            id: fields.NAME.key,
        },
        {
            name: fields.TYPE.fieldName,
            enableSorting: true,
            key: fields.TYPE.key,
            id: fields.TYPE.key,
        },
    ];

    if (enableActionCell) {
        tableColumns.push({
            name: "",
            enableSorting: false,
            key: "actions",
        });
    }

    if (enableDelete) {
        tableColumns.push({
            name: "",
            enableSorting: false,
            key: "remove",
        });
    }

    if (enableMenu) {
        tableColumns.push({
            name: "",
            enableSorting: false,
            key: fields.DOT_MENU.key,
            id: fields.DOT_MENU.key,
            align: "right",
        });
    }

    return tableColumns;
}

function TableView(props) {
    const {
        loading,
        error,
        listing,
        baseId,
        handleRequestSort,
        handleSelectAllClick,
        handleCheckboxClick,
        handleClick,
        handleDelete,
        handleDisable,
        order,
        orderBy,
        selected,
        canShare,
        onDetailsSelected,
        setSharingDlgOpen,
        onDocSelected,
        onSavedLaunchSelected,
        onDeleteSelected,
        enableMenu = true,
        enableSorting = true,
        enableSelection = true,
        enableDelete = false,
        enableActionCell = false,
        isAdminView,
        searchTerm,
        appBarHeight,
    } = props;
    const { t } = useTranslation("apps");
    const apps = listing?.apps;
    const columnData = getTableColumns(
        enableDelete,
        enableMenu,
        enableActionCell,
        t
    );
    const tableId = buildID(baseId, ids.LISTING_TABLE);

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <PageWrapper appBarHeight={appBarHeight || 0}>
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table
                    stickyHeader={true}
                    size="small"
                    aria-label={t("ariaTableListing")}
                    id={tableId}
                >
                    <DETableHead
                        selectable={enableSelection}
                        numSelected={selected?.length}
                        rowsInPage={listing?.apps ? listing.apps.length : 0}
                        order={order}
                        orderBy={orderBy}
                        baseId={tableId}
                        columnData={columnData}
                        onRequestSort={enableSorting && handleRequestSort}
                        onSelectAllClick={
                            handleSelectAllClick
                                ? handleSelectAllClick
                                : undefined
                        }
                    />
                    {loading && (
                        <TableLoading
                            numColumns={4}
                            numRows={25}
                            baseId={tableId}
                        />
                    )}
                    {!loading && (
                        <TableBody>
                            {(!apps || apps.length === 0) && !error && (
                                <EmptyTable
                                    message={t("noApps")}
                                    numColumns={columnData.length}
                                />
                            )}
                            {apps &&
                                apps.length > 0 &&
                                apps.map((app, index) => {
                                    const appId = app.id;
                                    const appName = app.name;
                                    const isSelected =
                                        selected?.indexOf(appId) !== -1;
                                    const rowId = buildID(
                                        baseId,
                                        tableId,
                                        appId
                                    );

                                    return (
                                        <DERow
                                            role="checkbox"
                                            tabIndex={-1}
                                            hover
                                            selected={isSelected}
                                            aria-checked={isSelected}
                                            key={app.id}
                                            id={rowId}
                                            onClick={(event) => {
                                                if (handleClick) {
                                                    handleClick(
                                                        event,
                                                        appId,
                                                        index
                                                    );
                                                }
                                            }}
                                        >
                                            {enableSelection && (
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
                                                                appId,
                                                                index
                                                            )
                                                        }
                                                        inputProps={{
                                                            "aria-label": t(
                                                                "ariaCheckbox",
                                                                {
                                                                    label: appName,
                                                                }
                                                            ),
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell
                                                padding="none"
                                                id={buildID(
                                                    rowId,
                                                    ids.APP_STATUS_ICON
                                                )}
                                            >
                                                <AppStatusIcon
                                                    isPublic={app.is_public}
                                                    isBeta={app.beta}
                                                    isDeleted={app.deleted}
                                                    isDisabled={app.disabled}
                                                    isBlessed={app.isBlessed}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <AppName
                                                    baseDebugId={buildID(
                                                        rowId,
                                                        ids.APP_NAME
                                                    )}
                                                    isDisabled={app.disabled}
                                                    name={app.name}
                                                    systemId={app.system_id}
                                                    appId={app.id}
                                                    searchTerm={searchTerm}
                                                    limitChecks={
                                                        app?.limitChecks
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell
                                                id={buildID(
                                                    rowId,
                                                    ids.APP_TYPE
                                                )}
                                            >
                                                {getAppTypeDisplay(app)}
                                            </TableCell>
                                            {enableActionCell && (
                                                <TableCell
                                                    align="right"
                                                    padding="none"
                                                >
                                                    <AppActionCell
                                                        baseId={rowId}
                                                        onDetailsSelected={
                                                            onDetailsSelected
                                                        }
                                                        app={app}
                                                    />
                                                </TableCell>
                                            )}
                                            {enableDelete && (
                                                <TableCell
                                                    align="right"
                                                    padding="none"
                                                >
                                                    <DeleteButton
                                                        baseId={rowId}
                                                        component="IconButton"
                                                        onClick={() => {
                                                            onDeleteSelected &&
                                                                onDeleteSelected(
                                                                    app
                                                                );
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            {enableMenu && (
                                                <TableCell align="right">
                                                    <RowDotMenu
                                                        baseId={buildID(
                                                            tableId,
                                                            appName
                                                        )}
                                                        app={app}
                                                        canShare={canShare}
                                                        handleDelete={
                                                            handleDelete
                                                        }
                                                        handleDisable={
                                                            handleDisable
                                                        }
                                                        onDetailsSelected={
                                                            onDetailsSelected
                                                        }
                                                        setSharingDlgOpen={
                                                            setSharingDlgOpen
                                                        }
                                                        onDocSelected={
                                                            onDocSelected
                                                        }
                                                        onSavedLaunchSelected={
                                                            onSavedLaunchSelected
                                                        }
                                                        isAdminView={
                                                            isAdminView
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
        </PageWrapper>
    );
}

export default TableView;
