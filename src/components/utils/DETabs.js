/**
 * @author sriram / aramsey
 *
 * Custom tab panel for DE
 *
 */

import React from "react";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import buildID from "components/utils/DebugIDUtil";
import ids from "../data/ids";

import { useMediaQuery, useTheme } from "@mui/material";

function DETabs(props) {
    const theme = useTheme();
    return (
        <Tabs
            sx={{
                "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                },
            }}
            {...props}
        />
    );
}

function DETab(props) {
    const theme = useTheme();
    return (
        <Tab
            sx={{
                "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
            }}
            {...props}
        />
    );
}

function DETabPanel(props) {
    const { children, value, selectedTab, tabId, dense = false } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <>
            <Divider />
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== selectedTab}
                id={buildID(tabId, ids.PANEL)}
                aria-labelledby={tabId}
            >
                <Box p={isMobile || dense ? 1 : 3}>{children}</Box>
            </Typography>
        </>
    );
}

export { DETab, DETabs, DETabPanel };
