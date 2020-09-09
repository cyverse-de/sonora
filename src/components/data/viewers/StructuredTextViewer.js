/**
 * View structured text files
 *
 * @author sriram
 *
 */

import React, { useMemo } from "react";
import { useTable } from "react-table";

import Toolbar from "./Toolbar";

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
    let cols = [{ Heading: "#", accessor: "index", disableSortBy: true }];
    if (!data || data.length === 0) {
        return cols;
    }
    Object.keys(data[0]).forEach((colId) => {
        if (colId !== "index") {
            cols.push({
                Heading: colId,
                accessor: colId,
                disableSortBy: true,
            });
        }
    });
    return cols;
}

export default function StructuredTextViewer(props) {
    const { path, resourceId, data, loading } = props;

    let columns = useMemo(() => getColumns(data), [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
        state,
    } = useTable({
        columns,
        data,
        initialState: {
            hiddenColumns: [],
        },
    });

    return (
        <PageWrapper appBarHeight={60}>
            <Toolbar
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={!state?.hiddenColumns?.includes("index")}
                onShowLineNumbers={(showLineNumbers) => {
                    if (showLineNumbers) {
                        setHiddenColumns([]);
                    } else {
                        setHiddenColumns(["index"]);
                    }
                }}
            />
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
                    <TableBody {...getTableBodyProps()}>
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
