/**
 * @author aramsey
 *
 * A component for showing a loading skeleton for a table.
 * The skeleton will be text boxes in the shape of however many rows
 * and columns.
 */
import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { TableBody, TableCell, TableRow } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Skeleton } from "@mui/material";

import ids from "../utils/ids";

const useStyles = makeStyles((theme) => ({
    skeleton: {
        backgroundColor: theme.palette.lightGray,
    },
}));

function TableLoading(props) {
    const { numColumns, numRows, baseId } = props;
    const classes = useStyles();
    const arrayRows = [...Array(numRows)];
    const arrayColumns = [...Array(numColumns)];

    return (
        <TableBody id={buildID(baseId, ids.LOADING_SKELETON)}>
            {arrayRows.map((element, rowIndex) => (
                <TableRow key={rowIndex}>
                    {arrayColumns.map((element, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton
                                variant="text"
                                classes={{ text: classes.skeleton }}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}

export default TableLoading;
