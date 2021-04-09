/**
 * @author sriram / aramsey
 *
 * Custom tab panel for DE
 *
 */

import React from "react";
import {
    Box,
    Divider,
    makeStyles,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core";
import { build } from "@cyverse-de/ui-lib";
import ids from "../data/ids";

import { useMediaQuery, useTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tabIndicator: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    tabSelected: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
}));

function DETabs(props) {
    const classes = useStyles();

    return <Tabs classes={{ indicator: classes.tabIndicator }} {...props} />;
}

function DETab(props) {
    const classes = useStyles();

    return <Tab classes={{ selected: classes.tabSelected }} {...props} />;
}

function DETabPanel(props) {
    const { children, value, selectedTab, tabId } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <>
            <Divider />
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== selectedTab}
                id={build(tabId, ids.PANEL)}
                aria-labelledby={tabId}
            >
                <Box p={isMobile ? 1 : 3}>{children}</Box>
            </Typography>
        </>
    );
}

export { DETab, DETabs, DETabPanel };
