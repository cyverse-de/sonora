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
import TableLoading from "../../utils/TableLoading";
import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Paper,
    useMediaQuery,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableSortLabel,
    TableHead,
    TableRow,
    Toolbar,
} from "@material-ui/core";

const SearchResultsTable = ({
    baseId,
    columns,
    data,
    loading,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const tableId = build(baseId, ids.TABLE_VIEW);
    const { t } = useTranslation("search");

    return (
        <PageWrapper appBarHeight={isMobile ? 210 : 225}>
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
                                            if (onSort) {
                                                onSort(
                                                    column.id,
                                                    !column.isSortedDesc
                                                );
                                            }
                                            toggleSortBy(
                                                column.id,
                                                !column.isSortedDesc,
                                                false
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
                    {loading && (
                        <TableLoading
                            numColumns={columns.length}
                            numRows={100}
                            baseId={baseId}
                        />
                    )}
                    {!loading && (
                        <TableBody>
                            {rows.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <TableRow {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <TableCell
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
            <Toolbar>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: 1 }}
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
