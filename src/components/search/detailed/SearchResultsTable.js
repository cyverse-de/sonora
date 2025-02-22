/**
 *
 * A generic tabular view to display search results.
 *
 * @author sriram
 *
 */

import React, { useEffect } from "react";
import { useRowSelect, useSortBy, useTable } from "react-table";
import { useTranslation } from "i18n";

import PageWrapper from "components/layout/PageWrapper";
import TableLoading from "components/table/TableLoading";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import DECheckbox from "components/utils/DECheckbox";

import {
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@mui/material";

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
    selectable,
    setSelectedResources,
}) => {
    const {
        toggleSortBy,
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
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
        useSortBy,
        useRowSelect,
        (hooks) =>
            hooks.visibleColumns.push((columns) => {
                return selectable
                    ? [
                          {
                              id: "selection",
                              Header: ({ getToggleAllRowsSelectedProps }) => (
                                  <DECheckbox
                                      {...getToggleAllRowsSelectedProps()}
                                  />
                              ),
                              Cell: ({ row }) => (
                                  <DECheckbox
                                      {...row.getToggleRowSelectedProps()}
                                  />
                              ),
                          },
                          ...columns,
                      ]
                    : columns;
            })
    );
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const tableId = buildID(baseId, ids.TABLE_VIEW);
    const { t } = useTranslation("search");

    useEffect(() => {
        setSelectedResources &&
            setSelectedResources(selectedFlatRows.map((row) => row.original));
    }, [selectedFlatRows, setSelectedResources]);

    return (
        <PageWrapper appBarHeight={isMobile ? 250 : 270}>
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
                            <TableRow
                                key={headerGroup.id}
                                {...headerGroup.getHeaderGroupProps()}
                            >
                                {headerGroup.headers.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        {...(column.id === "selection"
                                            ? column.getHeaderProps()
                                            : column.getHeaderProps(
                                                  column.getSortByToggleProps()
                                              ))}
                                        onClick={() => {
                                            if (column.id !== "selection") {
                                                onSort &&
                                                    onSort(
                                                        column.id,
                                                        !column.isSortedDesc
                                                    );
                                                toggleSortBy(
                                                    column.id,
                                                    !column.isSortedDesc,
                                                    false
                                                );
                                            }
                                        }}
                                    >
                                        {column.render("Header")}
                                        {column.canSort &&
                                        column.id !== "selection" ? (
                                            <TableSortLabel
                                                active={column.isSorted}
                                                direction={
                                                    column.isSortedDesc
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
                    {loading && (
                        <TableLoading
                            numColumns={columns.length}
                            numRows={100}
                            baseId={baseId}
                        />
                    )}
                    {!loading && (
                        <TableBody>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <TableRow
                                        key={row.id}
                                        {...row.getRowProps()}
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <TableCell
                                                    key={cell.row.id}
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
