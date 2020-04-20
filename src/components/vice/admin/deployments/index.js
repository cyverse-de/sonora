import React, { useState } from "react";

import {
    build as buildID,
    withI18N,
    getMessage as msg,
    EnhancedTableHead,
    //EmptyTable,
} from "@cyverse-de/ui-lib";

import {
    //makeStyles,
    Table,
    //TableBody,
    //TableCell,
    TableContainer,
    //TableRow,
} from "@material-ui/core";

import messages from "./messages";
import ids from "./ids";
import { COLUMNS } from "./constants";

// Constructs an ID for an element.
const id = (name) => buildID(ids.BASE, name);

const defineColumn = (name, keyID, align = "left", enableSorting = true) => ({
    name,
    align,
    enableSorting,
    key: keyID,
    id: keyID,
});

// The column definitions for the table.
const tableColumns = [
    defineColumn(msg("usernameColumn"), COLUMNS.USERNAME),
    defineColumn(msg("nameColumn"), COLUMNS.NAME),
    defineColumn(msg("appNameColumn"), COLUMNS.APP_NAME),
    defineColumn(msg("analysisNameColumn"), COLUMNS.ANALYSIS_NAME),
    defineColumn(msg("imageColumn"), COLUMNS.IMAGE),
    defineColumn(msg("portColumn"), COLUMNS.PORT),
    defineColumn(msg("uidColumn"), COLUMNS.UID),
    defineColumn(msg("gidColumn"), COLUMNS.GID),
    defineColumn(msg("commandColumn"), COLUMNS.COMMAND),
    defineColumn(msg("creationTimestampColumn"), COLUMNS.CREATION_TIMESTAMP),
];

const DeploymentTable = ({ deployments }) => {
    const [orderColumn, setOrderColumn] = useState(COLUMNS.USERNAME);
    const [order, setOrder] = useState("asc");

    const tableID = id(ids.ROOT);

    const handleRequestSort = (_event, property) => {
        const isAscending = orderColumn === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderColumn(orderColumn);
    };

    return (
        <TableContainer>
            <Table id={tableID}>
                <EnhancedTableHead
                    selectable={false}
                    baseId={tableID}
                    order={order}
                    orderBy={orderColumn}
                    columnData={tableColumns}
                    onRequestSort={handleRequestSort}
                ></EnhancedTableHead>
            </Table>
        </TableContainer>
    );
};

export default withI18N(DeploymentTable, messages);
