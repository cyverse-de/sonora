import React, { useState } from "react";

import {
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
    IconButton,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import ActionButtons from "./actionButtons";

import messages from "./messages";
import ids from "./ids";
import { id } from "./functions";
import useStyles from "./styles";

const ExtendedDataCard = ({
    columns,
    row,
    collapseID,
    showActions = false,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleUploadOutputs,
    handleDownloadInputs,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

    let display = "inline";
    if (isMedium) {
        display = "block";
    }

    return (
        <Box margin={1}>
            <div className={`${classes.extended} ${classes.actions}`}>
                {columns.map((column) => {
                    return (
                        <div
                            className={classes.dataEntry}
                            id={id(collapseID, column.field)}
                            key={id(collapseID, column.field)}
                        >
                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "label")}
                                classes={{ root: classes.dataEntryLabel }}
                            >
                                {column.name && `${column.name}:`}
                            </Typography>

                            <Typography
                                variant="body2"
                                align="left"
                                display={display}
                                id={id(collapseID, column.field, "value")}
                            >
                                {row &&
                                    row.hasOwnProperty(column.field) &&
                                    row[column.field]}
                            </Typography>
                        </div>
                    );
                })}
            </div>

            {showActions && (
                <ActionButtons
                    row={row}
                    handleDownloadInputs={handleDownloadInputs}
                    handleUploadOutputs={handleUploadOutputs}
                    handleExtendTimeLimit={handleExtendTimeLimit}
                    handleExit={handleExit}
                    handleSaveAndExit={handleSaveAndExit}
                />
            )}
        </Box>
    );
};

const CollapsibleTableRow = ({
    row,
    columns,
    baseID,
    startColumn,
    endColumn,
    showActions,
    onSelection = (_row, selected) => {},
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleUploadOutputs,
    handleDownloadInputs,
}) => {
    const defaultOpen = false;

    const [open, setOpen] = useState(defaultOpen);
    const classes = useStyles();

    const [selected, setSelected] = useState(false);

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newValue = !selected;
        setSelected(newValue);
        return onSelection(row, newValue);
    };

    const expanderID = id(baseID, "row", "expander");
    const rowID = id(baseID, "row");
    const collapseID = id(rowID, "collapse");

    return (
        <>
            <TableRow
                className={classes.row}
                key={rowID}
                id={rowID}
                selected={selected}
                onClick={handleClick}
            >
                <TableCell key={expanderID} id={expanderID}>
                    <IconButton
                        aria-label={msg("expandRow")}
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(!open);
                        }}
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

            <TableRow
                key={collapseID}
                id={collapseID}
                selected={selected}
                onClick={handleClick}
            >
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0, width: "90%" }}
                    colSpan={endColumn}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ExtendedDataCard
                            columns={columns.slice(endColumn)}
                            row={row}
                            collapseID={collapseID}
                            showActions={showActions}
                            handleExit={(analysisID, externalID) => {
                                setOpen(defaultOpen);
                                return handleExit(analysisID, externalID);
                            }}
                            handleSaveAndExit={(analysisID, externalID) => {
                                setOpen(defaultOpen);
                                return handleSaveAndExit(
                                    analysisID,
                                    externalID
                                );
                            }}
                            handleExtendTimeLimit={handleExtendTimeLimit}
                            handleUploadOutputs={handleUploadOutputs}
                            handleDownloadInputs={handleDownloadInputs}
                        />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const CollapsibleTable = ({
    columns,
    rows,
    title,
    showActions = false,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleDownloadInputs,
    handleUploadOutputs,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.up("xs"));
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isXL = useMediaQuery(theme.breakpoints.up("xl"));

    const [selectedRows, setSelectedRows] = useState([]);

    console.log(selectedRows);

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
    const defaultOrderColumn = columns[1].field;
    const [orderColumn, setOrderColumn] = useState(defaultOrderColumn);

    const defaultOrder = "asc";
    const [order, setOrder] = useState(defaultOrder);

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
                        {rows?.map((row, index) => (
                            <CollapsibleTableRow
                                row={row}
                                key={row.externalID}
                                baseID={row.externalID}
                                columns={columns}
                                startColumn={startColumn}
                                endColumn={endColumn}
                                showActions={showActions}
                                onSelection={(row, selected) => {
                                    selected
                                        ? setSelectedRows([
                                              row.externalID,
                                              ...selectedRows,
                                          ])
                                        : setSelectedRows(
                                              selectedRows.filter(
                                                  (value) =>
                                                      value !== row.externalID
                                              )
                                          );
                                }}
                                handleExit={handleExit}
                                handleSaveAndExit={handleSaveAndExit}
                                handleExtendTimeLimit={handleExtendTimeLimit}
                                handleDownloadInputs={handleDownloadInputs}
                                handleUploadOutputs={handleUploadOutputs}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default withI18N(CollapsibleTable, messages);
