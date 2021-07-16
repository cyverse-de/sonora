/**
 * @author sriram / aramsey
 *
 * Display Skeleton loading mask for grid
 *
 */

import React, { Fragment } from "react";
import buildID from "components/utils/DebugIDUtil";
import { Grid } from "@material-ui/core";
import GridLabelValue from "./GridLabelValue";
import { Skeleton } from "@material-ui/lab";
import ids from "./ids";

export default function GridLoading({ rows, baseId }) {
    const arrayRows = [...Array(rows)];
    return (
        <Grid id={buildID(baseId, ids.LOADING_SKELETON)} container spacing={2}>
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
