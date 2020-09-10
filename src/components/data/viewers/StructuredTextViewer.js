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
    Typography,
} from "@material-ui/core";

const LINE_NUMBER_ACCESSOR = "lineNumber";

function getColumns(data, firstRowHeader) {
    let cols = [
        {
            Header: "#",
            accessor: LINE_NUMBER_ACCESSOR,
            disableSortBy: true,
            Cell: ({ row }) => {
                return (
                    <Typography color="primary">
                        {row.original[LINE_NUMBER_ACCESSOR]}
                    </Typography>
                );
            },
        },
    ];

    if (!data || data.length === 0) {
        return cols;
    }

    let colHeaders = null;
    if (firstRowHeader) {
        colHeaders = data[0];
    }
    Object.keys(data[0]).forEach((colId) => {
        if (colId !== LINE_NUMBER_ACCESSOR) {
            if (colHeaders) {
                cols.push({
                    Header: colHeaders[colId],
                    accessor: colId,
                    disableSortBy: true,
                });
            } else {
                cols.push({
                    Header: colId,
                    accessor: colId,
                    disableSortBy: true,
                });
            }
        }
    });
    return cols;
}

function StructuredTextViewer(props) {
    const { path, resourceId, data, loading } = props;
    const [firstRowHeader, setFirstRowHeader] = React.useState(false);

    let columns = useMemo(() => getColumns(data, firstRowHeader), [
        data,
        firstRowHeader,
    ]);

    const dataToDisplay = useMemo(
        () => (firstRowHeader ? data.slice(1) : data),
        [data, firstRowHeader]
    );

    dataToDisplay.forEach((row, index) => {
        row[LINE_NUMBER_ACCESSOR] = index + 1; //line number starts from 1
    });

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
        data: dataToDisplay,
        initialState: {
            hiddenColumns: [],
        },
    });

    return (
        <PageWrapper appBarHeight={120}>
            <Toolbar
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={
                    !state?.hiddenColumns?.includes(LINE_NUMBER_ACCESSOR)
                }
                onShowLineNumbers={(showLineNumbers) => {
                    if (showLineNumbers) {
                        setHiddenColumns([]);
                    } else {
                        setHiddenColumns([LINE_NUMBER_ACCESSOR]);
                    }
                }}
                firstRowHeader={firstRowHeader}
                onFirstRowHeader={(header) => setFirstRowHeader(header)}
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
export default StructuredTextViewer;
export { LINE_NUMBER_ACCESSOR };
