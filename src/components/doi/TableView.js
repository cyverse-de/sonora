/**
 * @author sriram
 *
 * A tabular view of DOI requests
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import ids from "./ids";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import TableLoading from "components/utils/TableLoading";
import { DERow } from "components/utils/DERow";

import {
    build,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
} from "@cyverse-de/ui-lib";

import {
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Typography,
} from "@material-ui/core";

const columnData = (t) => {
    return [
        {
            id: ids.USER,
            name: t("user"),
            numeric: false,
            enableSorting: true,
            key: "requested_by",
        },
        {
            id: ids.PATH,
            name: t("path"),
            numeric: false,
            enableSorting: false,
            key: "folder.path",
        },
        {
            id: ids.DATE_SUBMITTED,
            name: t("dateSubmitted"),
            numeric: false,
            enableSorting: true,
            key: "date_submitted",
        },
        {
            id: ids.DATE_UPDATED,
            name: t("dateUpdated"),
            numeric: false,
            enableSorting: true,
            key: "date_updated",
        },
        {
            id: ids.TYPE,
            name: t("type"),
            numeric: false,
            enableSorting: true,
            key: "type",
        },
        {
            id: ids.STATUS,
            name: t("status"),
            numeric: false,
            enableSorting: true,
            key: "status",
        },
    ];
};

export default function TableView(props) {
    const {
        listing,
        loading,
        error,
        baseId,
        order,
        orderBy,
        selected,
        handleRequestSort,
        handleClick,
        handleUserNameClick,
        handlePathClick,
    } = props;
    const { t } = useTranslation("doi");
    const requests = listing?.requests;
    let columns = columnData(t);

    const tableId = build(baseId, ids.LISTING_TABLE);
    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }
    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                id={tableId}
                stickyHeader={true}
                size="small"
                aria-label={t("ariaTableListing")}
            >
                <EnhancedTableHead
                    baseId={baseId}
                    selectable={false}
                    rowsInPage={listing?.analyses?.length || 0}
                    order={order}
                    orderBy={orderBy}
                    columnData={columns}
                    onRequestSort={handleRequestSort}
                />
                {loading && (
                    <TableLoading
                        numColumns={columns.length}
                        numRows={25}
                        baseId={tableId}
                    />
                )}
                {!loading && (
                    <TableBody>
                        {(!requests || requests.length === 0) && !error && (
                            <EmptyTable
                                message={t("noRequests")}
                                numColumns={columns.length}
                            />
                        )}
                        {requests &&
                            requests.length > 0 &&
                            requests.map((request, index) => {
                                const id = request.id;
                                const isSelected = selected === id;
                                const rowId = build(baseId, tableId, id);
                                return (
                                    <DERow
                                        onClick={(event) =>
                                            handleClick(event, id, index)
                                        }
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={id}
                                        id={rowId}
                                    >
                                        <TableCell>
                                            <Link
                                                component="button"
                                                onClick={handleUserNameClick}
                                                color="primary"
                                            >
                                                <Typography variant="body2">
                                                    {request.requested_by}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                component="button"
                                                onClick={() =>
                                                    handlePathClick(id)
                                                }
                                                color="primary"
                                            >
                                                <Typography variant="body2">
                                                    {request?.folder?.path}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(
                                                    request.date_submitted
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(
                                                    request.date_updated
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(request.type)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.SUPPORT_CELL)}
                                        >
                                            <Typography variant="body2">
                                                {request.status}
                                            </Typography>
                                        </TableCell>
                                    </DERow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}
