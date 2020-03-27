<<<<<<< HEAD
/**
 * @author sriram
 *
 * A tabular view of apps
 *
 */

=======
>>>>>>> a5e0f9d... Basic app listing using react-query
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
<<<<<<< HEAD
        {
            name: "",
            numeric: false,
            enableSorting: false,
            key: AppFields.STATUS.key,
            id: AppFields.STATUS.key,
        },
=======
        { name: "", numeric: false, enableSorting: false, key: "status" },
>>>>>>> a5e0f9d... Basic app listing using react-query
        {
            name: AppFields.NAME.fieldName,
            enableSorting: true,
            key: AppFields.NAME.key,
<<<<<<< HEAD
            id: AppFields.NAME.key,
=======
>>>>>>> a5e0f9d... Basic app listing using react-query
        },
        {
            name: AppFields.INTEGRATOR.fieldName,
            enableSorting: true,
            key: AppFields.INTEGRATOR.key,
<<<<<<< HEAD
            id: AppFields.INTEGRATOR.key,
=======
>>>>>>> a5e0f9d... Basic app listing using react-query
        },
        {
            name: AppFields.RATING.fieldName,
            enableSorting: true,
            key: AppFields.RATING.key,
<<<<<<< HEAD
            id: AppFields.RATING.key,
=======
>>>>>>> a5e0f9d... Basic app listing using react-query
        },
        {
            name: AppFields.SYSTEM.fieldName,
            enableSorting: false,
            key: AppFields.SYSTEM.key,
<<<<<<< HEAD
            id: AppFields.SYSTEM.key,
=======
>>>>>>> a5e0f9d... Basic app listing using react-query
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
<<<<<<< HEAD
    const tableId = build(baseId, ids.LISTING_TABLE);
=======
    const tableId = build(baseId, ids.listingTable);
>>>>>>> a5e0f9d... Basic app listing using react-query
    return (
        <TableContainer
            component={Paper}
            style={{
                height: "60vh",
            }}
        >
            <Table stickyHeader={true} size="small">
                <EnhancedTableHead
                    selectable={true}
                    numSelected={selected.length}
                    rowsInPage={listing?.apps.length}
                    order={order}
                    orderBy={orderBy}
<<<<<<< HEAD
                    baseId={tableId}
=======
                    baseId="appTableView"
>>>>>>> a5e0f9d... Basic app listing using react-query
                    columnData={columnData}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading && (
                    <TableBody>
                        <TableLoading numColumns={6} numRows={25} />
                    </TableBody>
                )}
                {!loading && (
                    <TableBody>
                        {(!apps || apps.length === 0) && (
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
                                const rowId = build(baseId, appId);
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
                                                id={build(
                                                    tableId,
                                                    appName,
                                                    ids.checkbox
                                                )}
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
<<<<<<< HEAD
                                        <TableCell
                                            padding="none"
                                            id={build(
                                                rowId,
                                                ids.APP_STATUS_ICON
                                            )}
                                        >
=======
                                        <TableCell padding="none">
>>>>>>> a5e0f9d... Basic app listing using react-query
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
<<<<<<< HEAD
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
=======
                                        <TableCell>
                                            {app.integrator_name}
                                        </TableCell>
                                        <TableCell>
>>>>>>> a5e0f9d... Basic app listing using react-query
                                            <Rate
                                                name={app.id}
                                                value={
                                                    userRating || averageRating
                                                }
                                                readOnly={true}
                                                total={totalRating}
                                            />
                                        </TableCell>
<<<<<<< HEAD
                                        <TableCell
                                            align="right"
                                            id={build(rowId, ids.SYSTEM_ID)}
                                        >
=======
                                        <TableCell align="right">
>>>>>>> a5e0f9d... Basic app listing using react-query
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
