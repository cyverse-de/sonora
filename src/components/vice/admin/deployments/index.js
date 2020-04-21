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
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    TableRow,
} from "@material-ui/core";

import messages from "./messages";
import ids from "./ids";
import { COLUMNS } from "./constants";

// Constructs an ID for an element.
const id = (name) => buildID(ids.BASE, name);

const defineColumn = (
    name,
    keyID,
    field,
    align = "left",
    enableSorting = true
) => ({
    name,
    align,
    enableSorting,
    key: keyID,
    id: keyID,
    field,
});

// The column definitions for the table.
const tableColumns = [
    defineColumn("Username", COLUMNS.USERNAME, "username"),
    defineColumn("Name", COLUMNS.NAME, "name"),
    defineColumn("App Name", COLUMNS.APP_NAME, "appName"),
    defineColumn("Analysis Name", COLUMNS.ANALYSIS_NAME, "analysisName"),
    defineColumn("Image", COLUMNS.IMAGE, "image"),
    defineColumn("Port", COLUMNS.PORT, "port"),
    defineColumn("UID", COLUMNS.UID, "user"),
    defineColumn("GID", COLUMNS.GID, "group"),
    defineColumn("Command", COLUMNS.COMMAND, "command"),
    defineColumn(
        "Date Created",
        COLUMNS.CREATION_TIMESTAMP,
        "creationTimestamp"
    ),
];

const DeploymentTable = ({ deployments }) => {
    const [orderColumn, setOrderColumn] = useState(COLUMNS.USERNAME);
    const [order, setOrder] = useState("asc");

    const tableID = id(ids.ROOT);

    const handleRequestSort = (_event, property) => {
        const isAscending = orderColumn === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderColumn(property);
    };

    return (
        <TableContainer component={Paper}>
            <Table id={tableID}>
                <EnhancedTableHead
                    selectable={false}
                    baseId={tableID}
                    order={order}
                    orderBy={orderColumn}
                    columnData={tableColumns}
                    onRequestSort={handleRequestSort}
                ></EnhancedTableHead>
                <TableBody>
                    {deployments.map((row) => (
                        <TableRow key={row.externalID} id={id(row.externalID)}>
                            {tableColumns.map((column) => (
                                <TableCell
                                    key={id(
                                        `${row.externalID}.${column.field}`
                                    )}
                                >
                                    {row[column.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default withI18N(DeploymentTable, messages);
