/**
 * View structured text files
 *
 * @author sriram
 *
 */
import React, { useMemo } from "react";

import { useTable } from "react-table";

import ids from "./ids";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";

import PageWrapper from "components/layout/PageWrapper";

import { build } from "@cyverse-de/ui-lib";
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

export default function StructuredTextViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        data,
        loading,
        onRefresh,
        fileName,
    } = props;
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
                baseId={build(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
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
                onRefresh={onRefresh}
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
                <Table
                    id={build(baseId, ids.VIEWER_STRUCTURED, fileName)}
                    size="small"
                    stickyHeader
                    {...getTableProps()}
                >
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
