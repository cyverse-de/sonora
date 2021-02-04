/**
 * @author aramsey
 *
 * A simple table using react-table's helper functions
 * Enabling sorting is optional
 */

import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useSortBy, useTable } from "react-table";

import constants from "constants.js";

function BasicTable(props) {
    const {
        columns,
        data,
        tableSize = "small",
        sortable = false,
        bodyCellPadding = "default",
    } = props;

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        sortable && useSortBy
    );

    return (
        <Table size={tableSize} stickyHeader {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <TableCell
                                variant="head"
                                {...column.getHeaderProps(
                                    sortable && column.getSortByToggleProps()
                                )}
                            >
                                {column.render("Header")}
                                {sortable && (
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
            <TableBody>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <TableCell
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
        </Table>
    );
}

BasicTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};

export default BasicTable;
