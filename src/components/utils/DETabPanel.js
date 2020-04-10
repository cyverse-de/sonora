/**
 * @author sriram / aramsey
 *
 * Custom tab panel for DE
 *
 */

import { Box, Divider, Typography } from "@material-ui/core";
import { build } from "@cyverse-de/ui-lib";
import ids from "../data/ids";
import React from "react";

export default function DETabPanel(props) {
    const { children, value, selectedTab, tabId } = props;

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
                <Box p={3}>{children}</Box>
            </Typography>
        </>
    );
}
