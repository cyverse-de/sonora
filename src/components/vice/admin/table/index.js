import React, { useState } from "react";

import {
    build as buildID,
    withI18N,
    EnhancedTableHead,
    getMessage as msg,
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
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import messages from "./messages";
import ids from "./ids";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

// Constructs an ID for an element.
const id = (...names) => buildID(ids.BASE, ...names);

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(5),
    },
    title: {
        padding: theme.spacing(2),
    },
    table: {
        height: "100%",
    },
    extended: {
        display: "flex",
        marginLeft: theme.spacing(7),
        marginRight: theme.spacing(7),

        [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },

        flexWrap: "wrap",
        flexShrink: 0,
        flexGrow: 0,
    },
    row: {
        "& > *": {
            borderBottom: "unset",
        },
    },
    dataEntry: {
        [theme.breakpoints.up("xs")]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            width: 300,
            marginLeft: 0,
            marginRight: 0,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            width: 350,
            margin: theme.spacing(2),
        },
    },
    dataEntryLabel: {
        marginRight: theme.spacing(1),
        fontWeight: 500,
    },
}));

const ExtendedDataCard = ({ columns, row, collapseID }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

    let display = "inline";
    if (isMedium) {
        display = "block";
    }

    return (
        <Box margin={1}>
            <div className={classes.extended}>
                {columns.map((column) => {
                    return (
                        <div
                            className={classes.dataEntry}
                            id={id(collapseID, column.field)}
                        >
                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "label")}
                                classes={{ root: classes.dataEntryLabel }}
                            >
                                {`${column.name}:`}
                            </Typography>
                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "value")}
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

const CollapsibleTableRow = ({
    row,
    columns,
    baseID,
    startColumn,
    endColumn,
}) => {
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
                        aria-label={msg("expandRow")}
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {columns.slice(startColumn, endColumn).map((column) => {
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
                    colSpan={endColumn}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ExtendedDataCard
                            columns={columns.slice(endColumn)}
                            row={row}
                            collapseID={collapseID}
                        />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const CollapsibleTable = ({ columns, rows, title }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.up("xs"));
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isXL = useMediaQuery(theme.breakpoints.up("xl"));

    let startColumn;
    let endColumn;

    if (isXL) {
        startColumn = 1;
        endColumn = 7;
    } else if (isLarge) {
        startColumn = 1;
        endColumn = 6;
    } else if (isMedium) {
        startColumn = 1;
        endColumn = 4;
    } else if (isSmall) {
        startColumn = 1;
        endColumn = 2;
    } else {
        startColumn = 1;
        endColumn = 7;
    }

    // The first entry in columns should be the expander columns,
    // so default to the second entry for sorting. The field is the
    // actual name of the column.
    const [orderColumn, setOrderColumn] = useState(columns[1].field);

    const [order, setOrder] = useState("asc");

    const tableID = id(ids.ROOT);

    const sortAscending = (one, two) =>
        one[orderColumn].localeCompare(two[orderColumn]) * -1;

    const sortDescending = (one, two) =>
        one[orderColumn].localeCompare(two[orderColumn]);

    const handleRequestSort = (_event, columnName) => {
        const isAscending = orderColumn === columnName && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderColumn(columnName);

        if (isAscending) {
            rows.sort(sortAscending);
        } else {
            rows.sort(sortDescending);
        }
    };

    return (
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                id={id(tableID, "title")}
                className={classes.title}
            >
                {title}
            </Typography>
            <TableContainer classes={{ root: classes.root }}>
                <Table id={tableID} classes={{ root: classes.table }}>
                    <EnhancedTableHead
                        selectable={false}
                        baseId={tableID}
                        order={order}
                        orderBy={orderColumn}
                        columnData={columns.slice(0, endColumn)}
                        onRequestSort={handleRequestSort}
                    ></EnhancedTableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <CollapsibleTableRow
                                row={row}
                                key={index}
                                columns={columns}
                                startColumn={startColumn}
                                endColumn={endColumn}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default withI18N(CollapsibleTable, messages);
