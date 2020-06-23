import React from "react";

import Checkbox from "@material-ui/core/Checkbox";
import MaUTable from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import {
    useFlexLayout,
    useRowSelect,
    useSortBy,
    useTable,
} from "react-table";

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <Checkbox ref={resolvedRef} {...rest} />
            </>
        );
    }
);



const EnhancedTable = ({ columns, data }) => {
    const defaultColumn = React.useMemo(
        () => ({
          // When using the useFlexLayout:
          minWidth: 30, // minWidth is only used as a limit for resizing
          width: 100, // width is used for both the flex-basis and flex-grow
          maxWidth: 350, // maxWidth is only used as a limit for resizing
        }),
        []
      );
    const { getTableProps, headerGroups, prepareRow, rows,state: { selectedRowIds }, } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useFlexLayout,
        useSortBy,
        useRowSelect,
        hooks => {
            hooks.allColumns.push(columns => [
              // Let's make a column for selection
              {
                id: 'selection',
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                  <div>
                    <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                  </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }) => (
                  <div>
                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                  </div>
                ),
              },
              ...columns,
            ])
          }
    );
    console.log("No.of rows selected: " + Object.keys(selectedRowIds).length);      
    // Render the UI for your table
    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <MaUTable size="small" stickyHeader {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <TableCell
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
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <TableCell {...cell.getCellProps()} style={{overflow: "ellipsis"}}>
                                            {cell.render("Cell")}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </MaUTable>
        </TableContainer>
    );
};
export default EnhancedTable;
