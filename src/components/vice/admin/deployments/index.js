import React, { useState } from "react";

import {
    build as buildID,
    withI18N,
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
    defineColumn("Username", COLUMNS.USERNAME),
    defineColumn("Name", COLUMNS.NAME),
    defineColumn("App Name", COLUMNS.APP_NAME),
    defineColumn("Analysis Name", COLUMNS.ANALYSIS_NAME),
    defineColumn("Image", COLUMNS.IMAGE),
    defineColumn("Port", COLUMNS.PORT),
    defineColumn("UID", COLUMNS.UID),
    defineColumn("GID", COLUMNS.GID),
    defineColumn("Command", COLUMNS.COMMAND),
    defineColumn("Date Created", COLUMNS.CREATION_TIMESTAMP),
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
