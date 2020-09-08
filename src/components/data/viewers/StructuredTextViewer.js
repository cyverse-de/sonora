/**
 * View structured text files
 *
 * @author sriram
 *
 */

import React, { useMemo } from "react";
import { useTable } from "react-table";
import PageWrapper from "components/layout/PageWrapper";
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";

function getColumns(data) {
    let cols = [];
    if (!data || data.length === 0) {
        return cols;
    }
    Object.keys(data[0]).forEach((colId) =>
        cols.push({
            Heading: colId,
            accessor: colId,
            disableSortBy: true,
        })
    );
    return cols;
}

export default function StructuredTextViewer(props) {
    const { data, loading } = props;
    let columns = useMemo(() => getColumns(data), [data]);

    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    return (
        <PageWrapper appBarHeight={60}>
            {loading && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table size="small" stickyHeader {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageWrapper>
    );
}
