/**
 * @author aramsey
 *
 * A simple table using @tanstack/react-table's helper functions
 * Enabling sorting is optional
 */

import React from "react";

import TableLoading from "components/table/TableLoading";
import EmptyTable from "components/table/EmptyTable";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import PropTypes from "prop-types";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";

import constants from "constants.js";

function BasicTable(props) {
    const {
        baseId,
        columns,
        data,
        tableSize = "small",
        sortable = false,
        bodyCellPadding = "normal",
        loading,
        emptyDataMessage,
    } = props;

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        ...(sortable && { getSortedRowModel: getSortedRowModel() }),
    });

    return (
        <TableContainer style={{ overflow: "auto" }}>
            <Table
                size={tableSize}
                stickyHeader
                style={{ overflow: "auto" }}
            >
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    variant="head"
                                    onClick={
                                        sortable &&
                                        header.column.getCanSort()
                                            ? header.column.getToggleSortingHandler()
                                            : undefined
                                    }
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {sortable &&
                                        header.column.getCanSort() && (
                                            <TableSortLabel
                                                active={
                                                    !!header.column.getIsSorted()
                                                }
                                                direction={
                                                    header.column.getIsSorted() ===
                                                    "desc"
                                                        ? constants.SORT_DESCENDING
                                                        : constants.SORT_ASCENDING
                                                }
                                            />
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                {loading && (
                    <TableLoading
                        numColumns={columns.length}
                        numRows={100}
                        baseId={baseId}
                    />
                )}
                {!loading && data?.length === 0 && (
                    <TableBody>
                        <EmptyTable
                            message={emptyDataMessage || ""}
                            numColumns={columns.length}
                        />
                    </TableBody>
                )}
                {!loading && data?.length > 0 && (
                    <TableBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                padding={bodyCellPadding}
                                            >
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
                )}
            </Table>
        </TableContainer>
    );
}

BasicTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};

export default BasicTable;
