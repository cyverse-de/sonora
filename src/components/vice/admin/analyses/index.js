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
    defineColumn("Analysis Name", COLUMNS.ANALYSIS_NAME, "analysisName"),
    defineColumn("App Name", COLUMNS.APP_NAME, "appName"),
    defineColumn(
        "Date Created",
        COLUMNS.CREATION_TIMESTAMP,
        "creationTimestamp"
    ),
];

const getAnalyses = ({ deployments }) => {
    let analyses = {};

    // Should only need to interate through the deployments to find the
    // list of analyses in the data.
    deployments.forEach((element) => {
        if (!analyses.hasOwnProperty(element.externalID)) {
            analyses[element.externalID] = {
                externalID: element.externalID,
                username: element.username,
                analysisName: element.analysisName,
                appName: element.appName,
                creationTimestamp: element.creationTimestamp,
            };
        }
    });

    return Object.values(analyses);
};

const AnalysisTable = ({ data }) => {
    const [orderColumn, setOrderColumn] = useState(COLUMNS.USERNAME);
    const [order, setOrder] = useState("asc");
    const analyses = getAnalyses(data);

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
                    {analyses.map((row) => (
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

export default withI18N(AnalysisTable, messages);
