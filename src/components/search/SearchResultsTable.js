/**
 *
 * A generic tabular view to display search results.
 *
 * @author sriram
 *
 */

import React from "react";
import { useTable } from "react-table";

import PageWrapper from "components/layout/PageWrapper";
import ids from "./ids";

import { build } from "@cyverse-de/ui-lib";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";

const SearchResultsTable = ({
    baseId,
    columns,
    data,
    ref,
    fetchMore,
    canFetchMore,
    isFetchingMore,
}) => {
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });
    const tableId = build(baseId, ids.TABLE_VIEW);
    return (
        <PageWrapper appBarHeight={150}>
            {isFetchingMore && (
                <CircularProgress
                    size={20}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <TableContainer
                component={Paper}
                style={{ overflow: "auto" }}
                id={tableId}
            >
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
            <Toolbar>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: 1 }}
                    ref={ref}
                    onClick={() => fetchMore()}
                    disabled={!canFetchMore || isFetchingMore}
                >
                    Load More
                </Button>
            </Toolbar>
        </PageWrapper>
    );
};

export default SearchResultsTable;
