import React, { useEffect } from "react";

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
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import { useTable } from "react-table";

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
    const theme = useTheme();

    const isXL = useMediaQuery(theme.breakpoints.up("xl"));
    const isSmall = useMediaQuery(theme.breakpoints.up("xs"));
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    let numVisibleColumns;

    if (isXL) {
        numVisibleColumns = 7;
    } else if (isLarge) {
        numVisibleColumns = 6;
    } else if (isMedium) {
        numVisibleColumns = 4;
    } else if (isSmall) {
        numVisibleColumns = 2;
    } else {
        numVisibleColumns = 7;
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        setHiddenColumns,
    } = useTable({
        columns,
        data,
    });

    useEffect(() => {
        setHiddenColumns(
            columns.slice(numVisibleColumns).map((column) => column.id)
        );
    }, [setHiddenColumns, columns, numVisibleColumns]);

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
