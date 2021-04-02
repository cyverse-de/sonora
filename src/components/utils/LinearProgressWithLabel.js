/**
 * @author aramsey
 *
 * Copied from material-ui's example:
 * https://material-ui.com/components/progress/#linear-with-label
 */

import React from "react";
import { Box, LinearProgress, Typography } from "@material-ui/core";

function LinearProgressWithLabel(props) {
    const { value } = props;
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default LinearProgressWithLabel;
