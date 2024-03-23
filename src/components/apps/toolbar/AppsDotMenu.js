/**
 * @author sriram
 *
 * A dot menu intended for the Apps view.
 */

import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import ids from "../ids";

import CreateAppMenuItem from "../menuItems/CreateAppMenuItem";
import CreateWorkflowMenuItem from "../menuItems/CreateWorkflowMenuItem";
import DocMenuItem from "../menuItems/DocMenuItem";
import SavedLaunchMenuItem from "../menuItems/SavedLaunchMenuItem";

import shareIds from "components/sharing/ids";
import NavigationConstants from "common/NavigationConstants";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    FilterList,
    Build,
    Info,
    Queue as AddToBagIcon,
    PlayArrowRounded,
} from "@mui/icons-material";
import SharingMenuItem from "components/sharing/SharingMenuItem";

function AppsDotMenu(props) {
    const {
        baseId,
        ButtonProps,
        detailsEnabled,
        onDetailsSelected,
        onFilterSelected,
        addToBagEnabled,
        onAddToBagClicked,
        canShare,
        setSharingDlgOpen,
        onDocSelected,
        onQLSelected,
    } = props;
    const { t } = useTranslation(["apps", "common"]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    if (!detailsEnabled && !canShare && !isMobile) {
        return null;
    }
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            buttonText={t("common:dotMenuText")}
            render={(onClose) => [
                detailsEnabled && (
                    <MenuItem
                        key={buildID(baseId, ids.DETAILS_MENU_ITEM)}
                        id={buildID(baseId, ids.DETAILS_MENU_ITEM)}
                        onClick={() => {
                            onClose();
                            onDetailsSelected();
                        }}
                    >
                        <ListItemIcon>
                            <Info fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("details")} />
                    </MenuItem>
                ),
                addToBagEnabled && (
                    <MenuItem
                        key={buildID(baseId, ids.ADD_TO_BAG_MENU_ITEM)}
                        id={buildID(baseId, ids.ADD_TO_BAG_MENU_ITEM)}
                        onClick={() => {
                            onClose();
                            onAddToBagClicked();
                        }}
                    >
                        <ListItemIcon>
                            <AddToBagIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("addToBag")} />
                    </MenuItem>
                ),
                isMobile && (
                    <MenuItem
                        key={buildID(baseId, ids.FILTER_MENU_ITEM)}
                        id={buildID(baseId, ids.FILTER_MENU_ITEM)}
                        onClick={() => {
                            onClose();
                            onFilterSelected();
                        }}
                    >
                        <ListItemIcon>
                            <FilterList fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("filterLbl")} />
                    </MenuItem>
                ),
                canShare && (
                    <SharingMenuItem
                        key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                ),
                detailsEnabled && (
                    <DocMenuItem
                        key={buildID(baseId, ids.DOC_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onDocSelected={onDocSelected}
                    />
                ),
                detailsEnabled && (
                    <SavedLaunchMenuItem
                        key={buildID(baseId, ids.SAVED_LAUNCH_MENU_ITEM)}
                        baseId={baseId}
                        onClose={onClose}
                        onQLSelected={onQLSelected}
                    />
                ),
                <Divider
                    key={buildID(baseId, ids.MANAGE_TOOLS_DIVIDER)}
                    id={buildID(baseId, ids.MANAGE_TOOLS_DIVIDER)}
                />,
                <Link
                    key={ids.TOOLS_MENU_ITEM}
                    href={NavigationConstants.TOOLS}
                    legacyBehavior
                >
                    <MenuItem id={buildID(baseId, ids.TOOLS_MENU_ITEM)}>
                        <ListItemIcon>
                            <Build fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("manageTools")} />
                    </MenuItem>
                </Link>,
                <Link
                    key={ids.INSTANT_LAUNCH_MI}
                    href={NavigationConstants.INSTANT_LAUNCHES}
                    legacyBehavior
                >
                    <MenuItem id={buildID(baseId, ids.INSTANT_LAUNCH_MI)}>
                        <ListItemIcon>
                            <PlayArrowRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("instantLaunches")} />
                    </MenuItem>
                </Link>,
                <CreateAppMenuItem
                    key={ids.CREATE_APP_MENU_ITEM}
                    baseId={baseId}
                />,
                <CreateWorkflowMenuItem
                    key={ids.CREATE_WORKFLOW_MENU_ITEM}
                    baseId={baseId}
                />,
            ]}
        />
    );
}

export default AppsDotMenu;
