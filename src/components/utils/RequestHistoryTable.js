/**
 * A tabular view to show the history of tool request or perm id request.
 *
 * @author Sriram
 *
 **/
import React, { useState } from "react";

import ids from "./ids";
import DETableHead from "components/utils/DETableHead";
import { formatDate, stableSort, getSorting } from "@cyverse-de/ui-lib";

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    Typography,
} from "@material-ui/core";

export default function RequestHistoryTable(props) {
    const { history, t, baseId } = props;
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
            name: t("status"),
            numeric: false,
            enableSorting: false,
        },
        {
            id: ids.DATE_SUBMITTED,
            name: t("date"),
            numeric: false,
            enableSorting: true,
            key: "status_date",
        },
        {
            id: ids.COMMENTS,
            name: t("comments"),
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
            <DETableHead
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
