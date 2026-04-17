/**
 *
 * A generic tabular view to display search results.
 *
 * @author sriram
 *
 */

import React, { useEffect, useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
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
    const [sorting, setSorting] = useState(initialSortBy || []);
    const [rowSelection, setRowSelection] = useState({});

    const selectionColumn = useMemo(
        () => ({
            id: "selection",
            header: ({ table }) => (
                <DECheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <DECheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
        }),
        []
    );

    const tableColumns = useMemo(
        () => (selectable ? [selectionColumn, ...columns] : columns),
        [selectable, selectionColumn, columns]
    );

    const table = useReactTable({
        columns: tableColumns,
        data,
        state: { sorting, rowSelection },
        onSortingChange: (updater) => {
            const newSorting =
                typeof updater === "function" ? updater(sorting) : updater;
            setSorting(newSorting);
            if (newSorting.length > 0) {
                onSort?.(newSorting[0].id, newSorting[0].desc);
            }
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: selectable,
        manualSorting: true,
        enableMultiSort: false,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const tableId = buildID(baseId, ids.TABLE_VIEW);
    const { t } = useTranslation("search");

    useEffect(() => {
        setSelectedResources?.(
            table.getSelectedRowModel().rows.map((row) => row.original)
        );
    }, [rowSelection, setSelectedResources, table]);

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
                <Table size="small" stickyHeader>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        onClick={
                                            header.column.getCanSort()
                                                ? header.column.getToggleSortingHandler()
                                                : undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {header.column.getCanSort() ? (
                                            <TableSortLabel
                                                active={
                                                    !!header.column.getIsSorted()
                                                }
                                                direction={
                                                    header.column.getIsSorted() ===
                                                    "desc"
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
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
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
