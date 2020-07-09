import React, { useLayoutEffect } from "react";

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
    useTheme,
    useMediaQuery,
    //    IconButton,
} from "@material-ui/core";

// import { Skeleton } from "@material-ui/lab";

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
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));
    const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setHiddenColumns,
        rows,
    } = useTable({
        columns,
        data,
    });

    useLayoutEffect(() => {
        let numCols;

        if (isXL) {
            numCols = 7;
        } else if (isLarge) {
            numCols = 6;
        } else if (isMedium) {
            numCols = 4;
        } else if (isSmall) {
            numCols = 2;
        } else {
            numCols = 7;
        }

        setHiddenColumns(columns.slice(numCols).map((column) => column.id));
    }, [setHiddenColumns, columns, isXL, isLarge, isMedium, isSmall]);

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
