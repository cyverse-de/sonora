/**
 * @author aramsey
 *
 * A wrapper component that goes around each page and provides the max
 * height that page can use.  This should enable dynamic scrolling capabilities.
 */

import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
    },
}));

function PageWrapper(props) {
    const { appBarHeight } = props;
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div
            className={classes.wrapper}
            style={{
                maxHeight: `calc(100vh - ${appBarHeight + theme.spacing(1)}px)`,
            }}
        >
            {props.children}
        </div>
    );
}

export default PageWrapper;
