/**
 * @author aramsey
 *
 * A drawer intended to show data details such as permissions, path, info type,
 * file size, tags, etc.
 */
import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import { Drawer, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { useTranslation } from "i18n";

import DetailsTabPanel from "./DetailsPanel";
import ids from "../ids";
import ResourceIcon from "../listing/ResourceIcon";
import styles from "../styles";
import PermissionsTabPanel from "./PermissionsPanel";
import { DETab, DETabPanel, DETabs } from "../../utils/DETabs";

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
        onPublicLinksSelected,
    } = props;
    const classes = useStyles();

    const [selectedTab, setSelectedTab] = useState(TABS.details);
    const [selfPermission, setSelfPermission] = useState("");
    const { t } = useTranslation("data");

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const drawerId = buildID(baseId, ids.DETAILS_DRAWER);
    const detailsTabId = buildID(drawerId, ids.DETAILS_TAB);
    const permissionsTabId = buildID(drawerId, ids.PERMISSIONS_TAB);

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
                <ResourceIcon type={resource.type} />
                <Typography variant="h6" className={classes.restrictWidth}>
                    {resource.label}
                </Typography>
            </div>

            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.details}
                    label={t("details")}
                    id={detailsTabId}
                    aria-controls={buildID(detailsTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.permissions}
                    label={t("permissions")}
                    id={permissionsTabId}
                    aria-controls={buildID(permissionsTabId, ids.PANEL)}
                />
            </DETabs>
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
                    onPublicLinksSelected={onPublicLinksSelected}
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
                />
            </DETabPanel>
        </Drawer>
    );
}

export default DetailsDrawer;
