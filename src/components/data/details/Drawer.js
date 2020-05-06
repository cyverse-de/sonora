/**
 * @author aramsey
 *
 * A drawer intended to show data details such as permissions, path, info type,
 * file size, tags, etc.
 */
import React, { useState } from "react";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { Drawer, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";

import DetailsTabPanel from "./DetailsPanel";
import ids from "../ids";
import messages from "../messages";
import ResourceIcon from "../listing/ResourceIcon";
import styles from "../styles";
import PermissionsTabPanel from "./PermissionsPanel";
import DETabPanel from "../../utils/DETabPanel";

const TABS = {
    details: "DETAILS",
    permissions: "PERMISSIONS",
};

const useStyles = makeStyles(styles);

function DetailsDrawer(props) {
    const {
        resource,
        open,
        onClose,
        baseId,
        infoTypes,
        handleDetailsError,
        handleInfoTypeChangeError,
        handleUpdatePermissionsError,
        handleFetchPermissionsError,
    } = props;
    const classes = useStyles();

    const [selectedTab, setSelectedTab] = useState(TABS.details);
    const [selfPermission, setSelfPermission] = useState("");

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const drawerId = build(baseId, ids.DETAILS_DRAWER);
    const detailsTabId = build(drawerId, ids.DETAILS_TAB);
    const permissionsTabId = build(drawerId, ids.PERMISSIONS_TAB);

    return (
        <Drawer
            onClose={onClose}
            open={open}
            anchor="right"
            PaperProps={{
                id: drawerId,
                classes: { root: classes.drawerPaper },
                variant: "outlined",
            }}
        >
            <div className={classes.drawerHeader}>
                <ResourceIcon
                    className={classes.resourceIcon}
                    type={resource.type}
                />
                <Typography variant="h6" className={classes.restrictWidth}>
                    {resource.label}
                </Typography>
            </div>

            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
            >
                <Tab
                    value={TABS.details}
                    label={getMessage("details")}
                    id={detailsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(detailsTabId, ids.PANEL)}
                />
                <Tab
                    value={TABS.permissions}
                    label={getMessage("permissions")}
                    id={permissionsTabId}
                    classes={{ selected: classes.tabSelected }}
                    aria-controls={build(permissionsTabId, ids.PANEL)}
                />
            </Tabs>
            <DETabPanel
                tabId={detailsTabId}
                value={TABS.details}
                selectedTab={selectedTab}
            >
                <DetailsTabPanel
                    baseId={detailsTabId}
                    resource={resource}
                    infoTypes={infoTypes}
                    setSelfPermission={setSelfPermission}
                    handleDetailsError={handleDetailsError}
                    handleInfoTypeChangeError={handleInfoTypeChangeError}
                />
            </DETabPanel>
            <DETabPanel
                tabId={permissionsTabId}
                value={TABS.permissions}
                selectedTab={selectedTab}
            >
                <PermissionsTabPanel
                    baseId={permissionsTabId}
                    resource={resource}
                    selfPermission={selfPermission}
                    handleFetchPermissionsError={handleFetchPermissionsError}
                    handelUpdatePermissionsError={handleUpdatePermissionsError}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default withI18N(DetailsDrawer, messages);
