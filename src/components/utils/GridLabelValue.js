/**
 * @author sriram /aramsey
 *
 * A util to display label value within a grid container
 *
 */

import React from "react";
import { Grid, Typography } from "@material-ui/core";

// A grid where the secondary column, values, intentionally take up more
// space than the first column, labels
export default function GridLabelValue(props) {
    const { label, children } = props;

    return (
        <>
            <Grid item sm={3} xs={6} md={3} lg={3}>
                <Typography component="span" variant="subtitle2">
                    {label}
                </Typography>
            </Grid>

            <Grid
                item
                sm={9}
                xs={6}
                md={9}
                lg={9}
                style={{
                    maxWidth: "100%",
                    wordBreak: "break-word",
                }}
            >
                {children}
            </Grid>
        </>
    );
}
