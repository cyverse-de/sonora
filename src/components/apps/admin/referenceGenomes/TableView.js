/**
 * @author sriram
 *
 * A table view for admin Reference Genome Listing
 *
 */

import React, { useState } from "react";

import {
    useRowSelect,
    useGlobalFilter,
    useSortBy,
    useTable,
} from "react-table";

import refGenomeConstants from "./constants";
import TableToolbar from "./Toolbar";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";

import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const IndeterminateCheckbox = React.forwardRef(function IndeterminateCheckbox(
    { indeterminate, ...rest },
    ref
) {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return <Checkbox type="Checkbox" ref={resolvedRef} {...rest} />;
});

const EnhancedTable = ({
    baseId,
    columns,
    data,
    onAddClicked,
    onDeletedClicked,
}) => {
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const {
        getTableProps,
        headerGroups,
        prepareRow,
        rows,
        preGlobalFilteredRows,
        setGlobalFilter,
        selectedFlatRows,
        state: { globalFilter },
        toggleRowSelected,
    } = useTable(
        {
            columns,
            data,
            disableSortBy: true,
            initialState: {
                sortBy: [
                    {
                        id: refGenomeConstants.keys.NAME,
                        desc: false,
                    },
                ],
            },
        },
        useGlobalFilter,
        useSortBy,
        useRowSelect,
        (hooks) => {
            hooks.allColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                    ),
                },
                ...columns,
            ]);
        }
    );

    const select = (rows) => {
        let newSelected = [...new Set([...selectedFlatRows, ...rows])];
        newSelected.forEach((row) => toggleRowSelected(row.index, true));
    };

    const deselect = (rows) => {
        const newSelected = selectedFlatRows.filter((row) =>
            rows.includes(row)
        );

        newSelected.forEach((row) => toggleRowSelected(row.index, false));
    };

    const rangeSelect = (start, end, row) => {
        if (start > -1) {
            const rangeIds = [];
            for (let i = start; i <= end; i++) {
                rangeIds.push(rows[i]);
            }

            let isTargetSelected = selectedFlatRows.includes(row);
            isTargetSelected ? deselect(rangeIds) : select(rangeIds);
        }
    };

    const handleClick = (event, row, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, row)
                : rangeSelect(lastSelectIndex, index, row);
        } else {
            toggleRowSelected(index, !row.isSelected);
        }

        setLastSelectIndex(index);
    };

    const tableId = buildID(baseId, ids.TABLE_VIEW);
    return (
        <>
            <TableToolbar
                baseId={tableId}
                preGlobalFilteredRows={preGlobalFilteredRows}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
                onAddClicked={onAddClicked}
                onDeletedClicked={onDeletedClicked}
            />
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
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
                                    >
                                        {column.render("Header")}
                                        {column.id !== "selection" ? (
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
                    <TableBody>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <TableRow
                                    key={row.id}
                                    {...row.getRowProps()}
                                    onClick={(event) =>
                                        handleClick(event, row, index)
                                    }
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
                </Table>
            </TableContainer>
        </>
    );
};
export default EnhancedTable;
