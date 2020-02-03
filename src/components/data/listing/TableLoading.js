import React from "react";

import { makeStyles, TableCell, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../styles";

const useStyles = makeStyles(styles);

function TableLoading(props) {
    const { numColumns, numRows } = props;
    const classes = useStyles();
    const arrayRows = [...Array(numRows)];
    const arrayColumns = [...Array(numColumns)];

    return arrayRows.map((element, rowIndex) => (
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
    ));
}

export default TableLoading;
