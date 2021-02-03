/**
 * A tabular view to show the history of tool request or perm id request.
 *
 * @author Sriram
 *
 **/
import React, { useState } from "react";

import ids from "./ids";
import {
    formatDate,
    stableSort,
    getSorting,
    EnhancedTableHead,
} from "@cyverse-de/ui-lib";

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    Typography,
} from "@material-ui/core";

export default function RequestHistoryTable(props) {
    const { history } = props;
    const baseId = ids.REQUEST_HISTORY_DLG;
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("status_date");
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };
    const columnData = [
        {
            id: ids.STATUS,
            name: "Status",
            numeric: false,
            enableSorting: false,
        },
        {
            id: ids.CREATED_DATE,
            name: "Date",
            numeric: false,
            enableSorting: true,
            key: "status_date",
        },
        {
            id: ids.COMMENT,
            name: "Comment",
            numeric: false,
            enableSorting: false,
        },
    ];
    return (
        <Table size="small">
            <TableBody>
                {stableSort(history, getSorting(order, orderBy))?.map((n) => {
                    return (
                        <TableRow key={n.status}>
                            <TableCell>
                                <Typography>{n.status}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {formatDate(n.status_date)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{n.comments}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <EnhancedTableHead
                columnData={columnData}
                selectable={false}
                order={order}
                orderBy={orderBy}
                baseId={baseId}
                onRequestSort={handleRequestSort}
            />
        </Table>
    );
}
