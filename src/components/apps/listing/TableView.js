/**
 * @author sriram
 *
 * A tabular view of apps
 *
 */

import React from "react";
import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatMessage,
    getMessage,
    Rate,
    withI18N,
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
import TableLoading from "../../utils/TableLoading";
import AppStatusIcon from "../AppStatusIcon";
import AppName from "../AppName";
import AppFields from "../AppFields";
import { injectIntl } from "react-intl";
import messages from "../messages";

function getTableColumns(deletable, enableMenu) {
    let tableColumns = [
        {
            name: "",
            numeric: false,
            enableSorting: false,
            key: AppFields.STATUS.key,
            id: AppFields.STATUS.key,
        },

        {
            name: AppFields.NAME.fieldName,
            enableSorting: true,
            key: AppFields.NAME.key,
            id: AppFields.NAME.key,
        },
        {
            name: AppFields.INTEGRATOR.fieldName,
            enableSorting: true,
            key: AppFields.INTEGRATOR.key,
            id: AppFields.INTEGRATOR.key,
        },
        {
            name: AppFields.RATING.fieldName,
            enableSorting: true,
            key: AppFields.RATING.key,
            id: AppFields.RATING.key,
        },
        {
            name: AppFields.SYSTEM.fieldName,
            enableSorting: false,
            key: AppFields.SYSTEM.key,
            id: AppFields.SYSTEM.key,
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
        order,
        orderBy,
        selected,
        intl,
    } = props;
    const apps = listing?.apps;
    const columnData = getTableColumns(false, false);
    const tableId = build(baseId, ids.LISTING_TABLE);
    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                stickyHeader={true}
                size="small"
                aria-label={formatMessage(intl, "ariaTableListing")}
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
                                message={getMessage("noApps")}
                                numColumns={columnData.length}
                            />
                        )}
                        {error && (
                            <EmptyTable
                                message={error.toString()}
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
                                                    "aria-label": formatMessage(
                                                        intl,
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
export default withI18N(injectIntl(TableView), messages);
