/**
 * @author aramsey
 *
 * A simple table using react-table's helper functions
 * Enabling sorting is optional
 */

import React from "react";

import TableLoading from "components/table/TableLoading";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    useTheme,
} from "@material-ui/core";
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
    const theme = useTheme();
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
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell
                                    variant="head"
                                    {...column.getHeaderProps(
                                        sortable &&
                                            column.getSortByToggleProps()
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
                {loading && (
                    <TableLoading
                        numColumns={columns.length}
                        numRows={100}
                        baseId={baseId}
                    />
                )}
                {!loading && data?.length === 0 && (
                    <Typography style={{ marginLeft: theme.spacing(1) }}>
                        {emptyDataMessage}
                    </Typography>
                )}
                {!loading && data?.length > 0 && (
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
