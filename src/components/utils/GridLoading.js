/**
 * @author sriram / aramsey
 *
 * Display Skeleton loading mask for grid
 *
 */

import React, { Fragment } from "react";
import { Grid } from "@material-ui/core";
import GridLabelValue from "./GridLabelValue";
import { Skeleton } from "@material-ui/lab";

export default function GridLoading({ rows }) {
    const arrayRows = [...Array(rows)];
    return (
        <Grid container spacing={2}>
            {arrayRows.map((el, index) => (
                <Fragment key={index}>
                    <GridLabelValue label={<Skeleton variant="text" />}>
                        <Skeleton variant="text" />
                    </GridLabelValue>
                </Fragment>
            ))}
        </Grid>
    );
}
