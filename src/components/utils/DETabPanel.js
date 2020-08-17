/**
 * @author sriram / aramsey
 *
 * Custom tab panel for DE
 *
 */

import React from "react";
import { Box, Divider, Typography } from "@material-ui/core";
import { build } from "@cyverse-de/ui-lib";
import ids from "../data/ids";

import { useMediaQuery, useTheme, Tabs } from "@material-ui/core";

export default function DETabPanel(props) {
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
                <Box p={isMobile? 1 : 3}>{children}</Box>
            </Typography>
        </>
    );
}
