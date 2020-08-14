/**
 *
 * A generic tabular view to display search results.
 *
 * @author sriram
 *
 */

import React from "react";
import { useTable, useSortBy } from "react-table";
import { useTranslation } from "i18n";

import PageWrapper from "components/layout/PageWrapper";
import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
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
    initialSortBy,
    onSort,
}) => {
    const {
        toggleSortBy,
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            manualSortBy: true,
            disableMultiSort: true,
            initialState: {
                sortBy: initialSortBy,
            },
        },
        useSortBy
    );
    const tableId = build(baseId, ids.TABLE_VIEW);
    const {t} = useTranslation("search");   
    return (
        <PageWrapper appBarHeight={150}>
            {isFetchingMore && (
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
                                    <TableCell
                                        {...column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )}
                                        onClick={() => {
                                            if(onSort) {
                                                onSort(column.id, !column.isSortedDesc);
                                            }
                                            toggleSortBy(
                                                column.id,
                                                !column.isSortedDesc,
                                                false
                                            );
                                            console.log(
                                                "header click=>" + column.id
                                            );
                                        }}
                                    >
                                        {column.render("Header")}
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={
                                                column.isSortedDesc
                                                    ? "desc"
                                                    : "asc"
                                            }
                                        />
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
                    {t("loadMore")}
                </Button>
            </Toolbar>
        </PageWrapper>
    );
};

export default SearchResultsTable;
