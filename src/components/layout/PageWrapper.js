/**
 * @author aramsey
 *
 * A wrapper component that goes around each page and provides the max
 * height that page can use.  This should enable dynamic scrolling capabilities.
 */

import React from "react";
import { useTheme } from "@mui/material";

import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
    },
}));

function PageWrapper(props) {
    const { appBarHeight } = props;
    const { classes } = useStyles();
    const theme = useTheme();
    return (
        <div
            className={classes.wrapper}
            style={{
                maxHeight: `calc(100vh - ${
                    appBarHeight + parseInt(theme.spacing(1), 10)
                }px)`,
                overflow: "auto",
            }}
        >
            {props.children}
        </div>
    );
}

export default PageWrapper;
