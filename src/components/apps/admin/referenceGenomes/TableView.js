/**
 * @author sriram
 *
 * A table view for admin Reference Genome Listing
 *
 */

import React, { useMemo, useState } from "react";

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";

import refGenomeConstants from "./constants";
import TableToolbar from "./Toolbar";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";

import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const EnhancedTable = ({
    baseId,
    columns,
    data,
    onAddClicked,
    onDeletedClicked,
}) => {
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState([
        { id: refGenomeConstants.keys.NAME, desc: false },
    ]);

    const selectionColumn = useMemo(
        () => ({
            id: "selection",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
        }),
        []
    );

    const tableColumns = useMemo(
        () => [selectionColumn, ...columns],
        [selectionColumn, columns]
    );

    const table = useReactTable({
        columns: tableColumns,
        data,
        state: { globalFilter, rowSelection, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const rows = table.getRowModel().rows;

    const select = (targetRows) => {
        const newSelection = { ...rowSelection };
        targetRows.forEach((row) => {
            newSelection[row.id] = true;
        });
        setRowSelection(newSelection);
    };

    const deselect = (targetRows) => {
        const newSelection = { ...rowSelection };
        targetRows.forEach((row) => {
            // Need to delete this key, rather than simply set it to `false`,
            // otherwise the `indeterminate` flag in the `selectionColumn`
            // header Checkbox does not work correctly.
            delete newSelection[row.id];
        });
        setRowSelection(newSelection);
    };

    const rangeSelect = (start, end, row) => {
        if (start > -1) {
            const rangeRows = [];
            for (let i = start; i <= end; i++) {
                rangeRows.push(rows[i]);
            }

            let isTargetSelected = row.getIsSelected();
            isTargetSelected ? deselect(rangeRows) : select(rangeRows);
        }
    };

    const handleClick = (event, row, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, row)
                : rangeSelect(lastSelectIndex, index, row);
        } else {
            row.toggleSelected(!row.getIsSelected());
        }

        setLastSelectIndex(index);
    };

    const tableId = buildID(baseId, ids.TABLE_VIEW);
    return (
        <>
            <TableToolbar
                baseId={tableId}
                preGlobalFilteredRows={table.getPreFilteredRowModel().rows}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
                onAddClicked={onAddClicked}
                onDeletedClicked={onDeletedClicked}
            />
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table size="small" stickyHeader>
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
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
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
                                            />
                                        ) : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    onClick={(event) =>
                                        handleClick(event, row, index)
                                    }
                                >
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
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default EnhancedTable;
