import React, { useLayoutEffect, useState } from "react";

import { withI18N, getMessage as msg } from "@cyverse-de/ui-lib";

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
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    TableSortLabel,
} from "@material-ui/core";

// import { Skeleton } from "@material-ui/lab";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import { useTable, useExpanded, useSortBy } from "react-table";

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

    // These should be the column IDs of the columns displayed in the
    // ExtendedDataCard, which currently corresponds to the hidden columns.
    const columnIDs = columns.map((c) => c.id);

    // Find only the cells for the hidden columns.
    const filteredCells = row.allCells.filter((row) => {
        return columnIDs.includes(row.column.id);
    });

    const newID = (value) => id(ids.BASE, collapseID, "cell", value);

    return (
        <Box>
            <div className={classes.extended} {...row.getRowProps()}>
                {filteredCells.map((cell, index) => {
                    const thisID = newID(index);
                    return (
                        <div
                            className={classes.dataEntry}
                            key={thisID}
                            id={thisID}
                        >
                            {cell.render("Header")}
                            {cell.render("Cell")}
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
    visibleColumns,
    hiddenColumns,
    baseID,
    showActions,
    handleExit,
    handleSaveAndExit,
    handleExtendTimeLimit,
    handleUploadOutputs,
    handleDownloadInputs,
}) => {
    const classes = useStyles();

    const rowID = id(baseID, "row");
    const collapseID = id(rowID, "collapse");

    return (
        <>
            <TableRow
                className={classes.row}
                key={rowID}
                id={rowID}
                {...row.getRowProps()}
            >
                {row.cells.map((cell) => {
                    return (
                        <TableCell {...cell.getCellProps()}>
                            {cell.render("Cell")}
                        </TableCell>
                    );
                })}
            </TableRow>

            <TableRow key={collapseID} id={collapseID}>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        width: "10%",
                    }}
                    colSpan={row.isExpanded ? 1 : 0}
                ></TableCell>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        width: "90%",
                    }}
                    colSpan={visibleColumns.length}
                >
                    <Collapse in={row.isExpanded} timeout="auto" unmountOnExit>
                        <ExtendedDataCard
                            columns={hiddenColumns}
                            row={row}
                            collapseID={collapseID}
                            showActions={showActions}
                            handleExit={handleExit}
                            handleSaveAndExit={handleSaveAndExit}
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

export const ExpanderColumn = {
    id: "expander",
    Header: () => null,
    Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
            <IconButton aria-label={msg("expandRow")} size="small">
                {row.isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
        </span>
    ),
    disableSortBy: true,
};

export const defineColumn = (
    name,
    keyID,
    field,
    align = "left",
    enableSorting = true
) => ({
    Header: (_table, _columnModel) => (
        <Typography variant="subtitle1" align={align}>
            {name}
        </Typography>
    ),
    Cell: ({ value }) => (
        <Typography variant="body2" align={align}>
            {value}
        </Typography>
    ),
    accessor: field,
    align,
    disableSortBy: !enableSorting,
    key: keyID,
    id: keyID,
});

const CollapsibleTable = ({
    columns,
    data,
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

    const isXL = useMediaQuery(theme.breakpoints.up("xl"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));
    const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
    const isExtraSmall = useMediaQuery(theme.breakpoints.up("xs"));

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setHiddenColumns,
        rows,
        visibleColumns,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        useExpanded
    );

    const [hiddenColumnObjs, setHiddenColumnObjs] = useState([]);

    useLayoutEffect(() => {
        let numCols;

        if (isXL) {
            numCols = 7;
        } else if (isLarge) {
            numCols = 6;
        } else if (isMedium) {
            numCols = 4;
        } else if (isSmall) {
            numCols = 3;
        } else if (isExtraSmall) {
            numCols = 2;
        } else {
            numCols = 7;
        }

        const hidden = columns.slice(numCols);
        setHiddenColumnObjs(hidden);
        setHiddenColumns(hidden.map((column) => column.id));
    }, [
        setHiddenColumns,
        columns,
        isXL,
        isLarge,
        isMedium,
        isSmall,
        isExtraSmall,
    ]);

    const tableID = id(ids.ROOT);

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
                <Table
                    id={tableID}
                    classes={{ root: classes.table }}
                    {...getTableProps()}
                >
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell
                                        {...column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )}
                                    >
                                        {column.canSort ? (
                                            <TableSortLabel
                                                active={column.isSorted}
                                                direction={
                                                    column.isSortedDesc
                                                        ? "desc"
                                                        : "asc"
                                                }
                                            >
                                                {column.render("Header")}
                                            </TableSortLabel>
                                        ) : (
                                            column.render("Header")
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    <TableBody {...getTableBodyProps()}>
                        {rows?.map((row, index) => {
                            prepareRow(row);

                            return (
                                <CollapsibleTableRow
                                    row={row}
                                    key={row.original.externalID}
                                    baseID={row.original.externalID}
                                    visibleColumns={visibleColumns}
                                    hiddenColumns={hiddenColumnObjs}
                                    handleExit={handleExit}
                                    handleSaveAndExit={handleSaveAndExit}
                                    handleExtendTimeLimit={
                                        handleExtendTimeLimit
                                    }
                                    handleDownloadInputs={handleDownloadInputs}
                                    handleUploadOutputs={handleUploadOutputs}
                                    showActions={showActions}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default withI18N(CollapsibleTable, messages);
