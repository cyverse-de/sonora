import React, { useState } from "react";

import {
    build as buildID,
    withI18N,
    EnhancedTableHead,
    //EmptyTable,
} from "@cyverse-de/ui-lib";

import {
    //makeStyles,
    Box,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Paper,
    TableRow,
    makeStyles,
    IconButton,
} from "@material-ui/core";

import messages from "./messages";
import ids from "./ids";
import { COLUMNS } from "./constants";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

// Constructs an ID for an element.
const id = (...names) => buildID(ids.BASE, ...names);

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

const useStyles = makeStyles((theme) => ({
    table: {
        height: "100%",
    },
    row: {
        "& > *": {
            borderBottom: "unset",
        },
    },
}));

// The column definitions for the table.
const tableColumns = [
    defineColumn("", COLUMNS.EXPAND, "", "left", false),
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
                appID: element.appID,
                userID: element.userID,
                namespace: element.namespace,
            };
        }
    });

    return Object.values(analyses);
};

const AnalysisRow = ({ row }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    return (
        <>
            <TableRow
                className={classes.row}
                key={row.externalID}
                id={id(row.externalID)}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {tableColumns.slice(1).map((column) => (
                    <TableCell key={id(row.externalID, column.field)}>
                        {row[column.field]}
                    </TableCell>
                ))}
            </TableRow>

            <TableRow
                key={`${row.externalID}.collapse`}
                id={id(row.externalID, "collapse")}
            >
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table
                                size="small"
                                aria-label="more analyses fields"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ExternalID</TableCell>
                                        <TableCell>AppID</TableCell>
                                        <TableCell>UserID</TableCell>
                                        <TableCell>Namespace</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{row.externalID}</TableCell>
                                        <TableCell>{row.appID}</TableCell>
                                        <TableCell>{row.userID}</TableCell>
                                        <TableCell>{row.namespace}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const AnalysisTable = ({ data }) => {
    const classes = useStyles();
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
            <Table id={tableID} classes={{ root: classes.table }}>
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
                        <AnalysisRow row={row} key={row.externalID} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default withI18N(AnalysisTable, messages);
