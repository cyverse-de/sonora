/**
 * @author aramsey
 *
 * A component for showing a loading skeleton for a table.
 * The skeleton will be text boxes in the shape of however many rows
 * and columns.
 */
import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { makeStyles, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import ids from "./ids";

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
        <TableBody id={build(baseId, ids.LOADING_SKELETON)}>
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
