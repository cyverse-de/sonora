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
    Paper,
    TableRow,
    Typography,
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
    rowColor: {
        "&:nth-of-type(2n)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
    extended: {
        display: "flex",
        marginLeft: theme.spacing(7),
        marginRight: theme.spacing(7),
        flexWrap: "wrap",
        flexShrink: 0,
        flexGrow: 0,
    },
    dataEntry: {
        width: 350,
        margin: theme.spacing(2),
    },
    dataEntryLabel: {
        marginRight: theme.spacing(1),
        fontWeight: 500,
    },
}));

const VISIBLE_START_COLUMN = 1;
const VISIBLE_END_COLUMN = 7;

const ExtendedDataCard = ({ columns, row, collapseID }) => {
    const classes = useStyles();
    const dataColumns = columns.slice(VISIBLE_END_COLUMN);

    return (
        <Box margin={1}>
            <div className={classes.extended}>
                {dataColumns.map((column) => {
                    return (
                        <div className={classes.dataEntry}>
                            <Typography
                                variant="body2"
                                align="left"
                                display="inline"
                                classes={{ root: classes.dataEntryLabel }}
                            >
                                {`${column.name}:`}
                            </Typography>
                            <Typography
                                variant="body2"
                                align="left"
                                display="inline"
                            >
                                {row[column.field] || "N/A"}
                            </Typography>
                        </div>
                    );
                })}
            </div>
        </Box>
    );
};

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
                    style={{ paddingBottom: 0, paddingTop: 0, width: "90%" }}
                    colSpan={VISIBLE_END_COLUMN}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {/* <ExtendedDataTable
                            columns={columns}
                            row={row}
                            collapseID={collapseID}
                        /> */}
                        <ExtendedDataCard
                            columns={columns}
                            row={row}
                            collapseID={collapseID}
                        />
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
