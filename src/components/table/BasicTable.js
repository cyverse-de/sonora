/**
 * @author aramsey
 *
 * A simple table using react-table's helper functions
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
import { useSortBy, useTable } from "react-table";

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
    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        sortable && useSortBy
    );

    return (
        <TableContainer style={{ overflow: "auto" }}>
            <Table
                size={tableSize}
                stickyHeader
                {...getTableProps()}
                style={{ overflow: "auto" }}
            >
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            {...headerGroup.getHeaderGroupProps()}
                        >
                            {headerGroup.headers.map((column) => (
                                <TableCell
                                    key={column.id}
                                    variant="head"
                                    {...column.getHeaderProps(
                                        sortable &&
                                            column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    {sortable && column.canSort && (
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={
                                                column.isSortedDesc
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
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell
                                                key={cell.row.id}
                                                padding={bodyCellPadding}
                                                {...cell.getCellProps()}
                                            >
                                                {cell.render("Cell")}
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
