/**
 * @author sriram
 *
 * A tabular view of Tool requests
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import ids from "../ids";
import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import TableLoading from "components/utils/TableLoading";
import { DERow } from "components/utils/DERow";
import PageWrapper from "components/layout/PageWrapper";

import DetailsDialog from "components/tools/requests/Details";

import {
    build,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
} from "@cyverse-de/ui-lib";

import {
    Button,
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
            id: ids.TOOL_REQUEST.NAME,
            name: t("name"),
            numeric: false,
            enableSorting: true,
            key: "name",
        },
        {
            id: ids.TOOL_REQUEST.REQUESTED_BY,
            name: t("requestedBy"),
            numeric: false,
            enableSorting: true,
            key: "requested_by",
        },
        {
            id: ids.TOOL_REQUEST.DATE_SUBMITTED,
            name: t("dateSubmitted"),
            numeric: false,
            enableSorting: true,
            key: "date_submitted",
        },
        {
            id: ids.TOOL_REQUEST.LAST_UPDATED,
            name: t("lastUpdated"),
            numeric: false,
            enableSorting: true,
            key: "date_updated",
        },
        {
            id: ids.TOOL_REQUEST.STATUS,
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
        handleStatusClick,
    } = props;
    const { t } = useTranslation("tools");
    const [detailsDlgOpen, setDetailsDlgOpen] = React.useState(false);
    const [selectedRequest, setSelectedRequest] = React.useState(null);

    const requests = listing?.tool_requests;
    let columns = columnData(t);

    const tableId = build(baseId, ids.LISTING_TABLE);
    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }
    return (
        <PageWrapper appBarHeight={230}>
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
                        rowsInPage={requests?.length || 0}
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
                                            <TableCell
                                                id={build(
                                                    rowId,
                                                    ids.TOOL_REQUEST.NAME
                                                )}
                                            >
                                                <Button
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedRequest(
                                                            request
                                                        );
                                                        setDetailsDlgOpen(true);
                                                    }}
                                                >
                                                    {request.name}
                                                </Button>
                                            </TableCell>
                                            <TableCell
                                                id={build(
                                                    rowId,
                                                    ids.TOOL_REQUEST
                                                        .REQUESTED_BY
                                                )}
                                            >
                                                <Typography variant="body2">
                                                    {request.requested_by}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                id={build(
                                                    rowId,
                                                    ids.TOOL_REQUEST
                                                        .DATE_SUBMITTED
                                                )}
                                            >
                                                <Typography variant="body2">
                                                    {formatDate(
                                                        request.date_submitted
                                                    )}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                id={build(
                                                    rowId,
                                                    ids.TOOL_REQUEST
                                                        .LAST_UPDATED
                                                )}
                                            >
                                                <Typography variant="body2">
                                                    {formatDate(
                                                        request.date_updated
                                                    )}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                id={build(
                                                    rowId,
                                                    ids.TOOL_REQUEST.STATUS
                                                )}
                                            >
                                                <Button
                                                    color="primary"
                                                    onClick={() =>
                                                        handleStatusClick(
                                                            request?.id
                                                        )
                                                    }
                                                >
                                                    {request.status}
                                                </Button>
                                            </TableCell>
                                        </DERow>
                                    );
                                })}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            <DetailsDialog
                open={detailsDlgOpen}
                onClose={() => setDetailsDlgOpen(false)}
                requestId={selectedRequest?.id}
            />
        </PageWrapper>
    );
}
