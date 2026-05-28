import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "i18n";

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
} from "@mui/material";

import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    flexRender,
} from "@tanstack/react-table";

import ActionButtons from "./actionButtons";

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
    const { classes } = useStyles();

    // These should be the column IDs of the columns displayed in the
    // ExtendedDataCard, which currently corresponds to the hidden columns.
    const columnIDs = columns.map((c) => c.id);

    // Find only the cells for the hidden columns.
    const filteredCells = row.getAllCells().filter((cell) => {
        return columnIDs.includes(cell.column.id);
    });

    const newID = (value) => id(ids.BASE, collapseID, "cell", value);

    return (
        <Box>
            <div className={classes.extended}>
                {filteredCells.map((cell, index) => {
                    const thisID = newID(index);
                    return (
                        <div
                            className={classes.dataEntry}
                            key={thisID}
                            id={thisID}
                        >
                            {flexRender(
                                cell.column.columnDef.header,
                                cell.getContext()
                            )}
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
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
    isMobile = false,
}) => {
    const { classes } = useStyles();

    const rowID = id(baseID, "row");
    const collapseID = id(rowID, "collapse");

    return (
        <>
            <TableRow className={classes.row} key={rowID} id={rowID}>
                {row.getVisibleCells().map((cell) => {
                    return (
                        <TableCell key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </TableCell>
                    );
                })}
            </TableRow>

            <TableRow key={collapseID} id={collapseID}>
                {!isMobile ? (
                    <TableCell
                        style={{
                            paddingBottom: 0,
                            paddingTop: 0,
                            width: "5%",
                        }}
                        colSpan={row.getIsExpanded() ? 1 : 0}
                    ></TableCell>
                ) : null}

                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        width: "95%",
                    }}
                    colSpan={visibleColumns.length}
                >
                    <Collapse
                        in={row.getIsExpanded()}
                        timeout="auto"
                        unmountOnExit
                    >
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

function ExpanderCell({ row }) {
    const { t } = useTranslation("vice-admin");

    return (
        <IconButton
            aria-label={t("expandRow")}
            size="small"
            onClick={row.getToggleExpandedHandler()}
        >
            {row.getIsExpanded() ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
    );
}

export const ExpanderColumn = {
    id: "expander",
    header: () => null,
    cell: ({ row }) => <ExpanderCell row={row} />,
    enableSorting: false,
};

export const defineColumn = (
    name,
    keyID,
    field,
    align = "left",
    enableSorting = true
) => ({
    header: () => (
        <Typography variant="subtitle1" align={align}>
            {name}
        </Typography>
    ),
    cell: ({ getValue }) => (
        <Typography variant="body2" align={align}>
            {getValue()}
        </Typography>
    ),
    accessorKey: field,
    align,
    enableSorting,
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
    const { classes } = useStyles();
    const theme = useTheme();

    const isXL = useMediaQuery(theme.breakpoints.up("xl"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));
    const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
    const isExtraSmall = useMediaQuery(theme.breakpoints.up("xs"));

    // Needs to be set in the useLayoutEffect, otherwise it acts weird
    // because the media queries generate incorrect results on the server.
    const [isMobile, setIsMobile] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [hiddenColumnObjs, setHiddenColumnObjs] = useState([]);

    const table = useReactTable({
        columns,
        data,
        state: { columnVisibility },
        onColumnVisibilityChange: setColumnVisibility,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    const visibleColumns = table.getVisibleLeafColumns();

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
        setIsMobile((isXL || isLarge || isMedium) === false);

        const hidden = columns.slice(numCols);
        setHiddenColumnObjs(hidden);

        const hiddenVisibility = {};
        hidden.forEach((column) => {
            hiddenVisibility[column.id] = false;
        });
        setColumnVisibility(hiddenVisibility);
    }, [columns, isXL, isLarge, isMedium, isSmall, isExtraSmall]);

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
                <Table id={tableID} classes={{ root: classes.table }}>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        onClick={
                                            header.column.getCanSort()
                                                ? header.column.getToggleSortingHandler()
                                                : undefined
                                        }
                                    >
                                        {header.column.getCanSort() ? (
                                            <TableSortLabel
                                                active={
                                                    !!header.column.getIsSorted()
                                                }
                                                direction={
                                                    header.column.getIsSorted() ===
                                                    "desc"
                                                        ? "desc"
                                                        : "asc"
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    <TableBody>
                        {table.getRowModel().rows?.map((row) => {
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
                                    isMobile={isMobile}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default CollapsibleTable;
