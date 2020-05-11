import React, { useState } from "react";

import {
    build as buildID,
    withI18N,
    EnhancedTableHead,
} from "@cyverse-de/ui-lib";

import {
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
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

// Constructs an ID for an element.
const id = (...names) => buildID(ids.BASE, ...names);

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(5),
    },
    table: {
        height: "100%",
    },
    row: {
        "& > *": {
            borderBottom: "unset",
        },
    },
}));

const VISIBLE_START_COLUMN = 1;
const VISIBLE_END_COLUMN = 7;

const CollapsibleTableRow = ({ row, columns, baseID }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const expanderID = id(baseID, "row", "expander");
    const rowID = id(baseID, "row");
    const collapseID = id(rowID, "collapse");

    return (
        <>
            <TableRow className={classes.row} key={rowID} id={rowID}>
                <TableCell key={expanderID} id={expanderID}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {columns
                    .slice(VISIBLE_START_COLUMN, VISIBLE_END_COLUMN)
                    .map((column) => {
                        const fieldID = id(rowID, column.field);
                        return (
                            <TableCell key={fieldID} id={fieldID}>
                                {row[column.field]}
                            </TableCell>
                        );
                    })}
            </TableRow>

            <TableRow key={collapseID} id={collapseID}>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={VISIBLE_END_COLUMN}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table
                                size="small"
                                aria-label="more analyses fields"
                                style={{ width: "100%" }}
                            >
                                <TableHead>
                                    <TableRow>
                                        {columns
                                            .slice(VISIBLE_END_COLUMN)
                                            .map((column) => {
                                                const colID = id(
                                                    collapseID,
                                                    column.field
                                                );
                                                return (
                                                    <TableCell
                                                        key={colID}
                                                        id={colID}
                                                    >
                                                        {column.name}
                                                    </TableCell>
                                                );
                                            })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow className={classes.row}>
                                        {columns
                                            .slice(VISIBLE_END_COLUMN)
                                            .map((column) => {
                                                const colID = id(
                                                    collapseID,
                                                    "value",
                                                    column.field
                                                );
                                                return (
                                                    <TableCell
                                                        id={colID}
                                                        key={colID}
                                                    >
                                                        {row[column.field]}
                                                    </TableCell>
                                                );
                                            })}
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

const CollapsibleTable = ({ columns, rows }) => {
    const classes = useStyles();

    // The first entry in columns should be the expander columns,
    // so default to the second entry for sorting. The field is the
    // actual name of the column.
    const [orderColumn, setOrderColumn] = useState(columns[1].field);

    const [order, setOrder] = useState("asc");

    const tableID = id(ids.ROOT);

    const handleRequestSort = (_event, property) => {
        const isAscending = orderColumn === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderColumn(property);
    };

    return (
        <TableContainer component={Paper} classes={{ root: classes.root }}>
            <Table id={tableID} classes={{ root: classes.table }}>
                <EnhancedTableHead
                    selectable={false}
                    baseId={tableID}
                    order={order}
                    orderBy={orderColumn}
                    columnData={columns.slice(0, VISIBLE_END_COLUMN)}
                    onRequestSort={handleRequestSort}
                ></EnhancedTableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <CollapsibleTableRow
                            row={row}
                            key={index}
                            columns={columns}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default withI18N(CollapsibleTable, messages);
