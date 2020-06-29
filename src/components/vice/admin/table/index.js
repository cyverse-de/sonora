import React from "react";

import {
    withI18N,
    //    getMessage as msg,
} from "@cyverse-de/ui-lib";

import {
    //    Box,
    //    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Paper,
    TableRow,
    Typography,
    //    IconButton,
    //    useTheme,
    //    useMediaQuery,
} from "@material-ui/core";

import {
    useGlobalFilter,
    useSortBy,
    useExpanded,
    useRowSelect,
    useTable,
} from "react-table";

//import ActionButtons from "./actionButtons";

import messages from "./messages";
import ids from "./ids";
import { id } from "./functions";
import useStyles from "./styles";

const CollapsibleTable = ({
    columns,
    data,
    title,
    // showActions = false,
    // handleExit,
    // handleSaveAndExit,
    // handleExtendTimeLimit,
    // handleDownloadInputs,
    // handleUploadOutputs,
}) => {
    const classes = useStyles();
    //const theme = useTheme();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        // preGlobalFilteredRows,
        // setGlobalFilter,
        rows,
        // state: {
        //     selectedRowIds, globalFilter, expanded,
        // },
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        useRowSelect,
        useExpanded
    );

    const tableID = id(ids.ROOT);

    return (
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                id={id(tableID, "title")}
                className={classes.title}
            >
                {title}
            </Typography>

            <TableContainer classes={{ root: classes.root }}>
                <Table
                    id={tableID}
                    classes={{ root: classes.table }}
                    {...getTableProps()}
                >
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </TableHead>

                    <TableBody {...getTableBodyProps()}>
                        {rows?.map((row, index) => {
                            prepareRow(row);

                            return (
                                <TableRow
                                    className={classes.row}
                                    {...row.getRowProps()}
                                >
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
        </Paper>
    );
};

export default withI18N(CollapsibleTable, messages);
