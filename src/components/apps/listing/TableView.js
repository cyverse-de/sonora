/**
 * @author sriram
 *
 * A tabular view of apps
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    Rate,
} from "@cyverse-de/ui-lib";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@material-ui/core";

import ids from "../ids";

import AppStatusIcon from "../AppStatusIcon";
import AppName from "../AppName";
import TableLoading from "components/utils/TableLoading";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import appFields from "../appFields";

function getTableColumns(deletable, enableMenu) {
    const fields = appFields();
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
            name: fields.INTEGRATOR.fieldName,
            enableSorting: true,
            key: fields.INTEGRATOR.key,
            id: fields.INTEGRATOR.key,
        },
        {
            name: fields.RATING.fieldName,
            enableSorting: true,
            key: fields.RATING.key,
            id: fields.RATING.key,
        },
        {
            name: fields.SYSTEM.fieldName,
            enableSorting: false,
            key: fields.SYSTEM.key,
            id: fields.SYSTEM.key,
            align: "right",
        },
    ];

    if (deletable) {
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
            key: "menu",
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
        handleClick,
        onRouteToApp,
        order,
        orderBy,
        selected,
    } = props;
    const { t } = useTranslation("apps");
    const apps = listing?.apps;
    const columnData = getTableColumns(false, false);
    const tableId = build(baseId, ids.LISTING_TABLE);

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                stickyHeader={true}
                size="small"
                aria-label={t("ariaTableListing")}
                id={tableId}
            >
                <EnhancedTableHead
                    selectable={true}
                    numSelected={selected.length}
                    rowsInPage={listing?.apps ? listing.apps.length : 0}
                    order={order}
                    orderBy={orderBy}
                    baseId={tableId}
                    columnData={columnData}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading && (
                    <TableLoading
                        numColumns={6}
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
                                const {
                                    average: averageRating,
                                    user: userRating,
                                    total: totalRating,
                                } = app.rating;
                                const appId = app.id;
                                const appName = app.name;
                                const isSelected =
                                    selected.indexOf(appId) !== -1;
                                const rowId = build(baseId, tableId, appId);
                                return (
                                    <TableRow
                                        role="checkbox"
                                        tabIndex={-1}
                                        hover
                                        selected={isSelected}
                                        aria-checked={isSelected}
                                        key={app.id}
                                        id={rowId}
                                        onClick={(event) =>
                                            handleClick(event, appId, index)
                                        }
                                    >
                                        <TableCell padding="checkbox">
                                            <DECheckbox
                                                checked={isSelected}
                                                tabIndex={0}
                                                id={build(rowId, ids.checkbox)}
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
                                        <TableCell
                                            padding="none"
                                            id={build(
                                                rowId,
                                                ids.APP_STATUS_ICON
                                            )}
                                        >
                                            <AppStatusIcon
                                                isPublic={app.is_public}
                                                isBeta={app.beta}
                                                isDisabled={app.disabled}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <AppName
                                                baseDebugId={build(
                                                    rowId,
                                                    ids.APP_NAME
                                                )}
                                                isDisabled={app.disabled}
                                                name={app.name}
                                                onAppNameClicked={() =>
                                                    onRouteToApp(
                                                        app.system_id,
                                                        app.id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={build(
                                                rowId,
                                                ids.integratorName
                                            )}
                                        >
                                            {app.integrator_name}
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.RATING)}
                                        >
                                            <Rate
                                                name={app.id}
                                                value={
                                                    userRating || averageRating
                                                }
                                                readOnly={true}
                                                total={totalRating}
                                            />
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            id={build(rowId, ids.SYSTEM_ID)}
                                        >
                                            {app.system_id}
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
export default TableView;
