/**
 * @author sriram
 *
 * A dot menu for Tools View.
 *
 */

import React from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import shareIds from "components/sharing/ids";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import { isWritable } from "../utils";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { Add, Delete, Info, Edit, FilterList, Send } from "@mui/icons-material";

function DotMenuItems(props) {
    const {
        baseId,
        onDetailsSelected,
        isSingleSelection,
        onClose,
        canShare,
        setSharingDlgOpen,
        onAddToolSelected,
        onEditToolSelected,
        onRequestToolSelected,
        allowEditing,
        onFilterSelected,
        onDeleteToolSelected,
        allowDeletes,
        isAdmin,
    } = props;

    const { t } = useTranslation("tools");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return [
        <Hidden mdUp key="hiddenMdUp">
            {isSingleSelection && (
                <MenuItem
                    key={buildID(baseId, ids.MANAGE_TOOLS.TOOL_INFO_MI)}
                    id={buildID(baseId, ids.MANAGE_TOOLS.TOOL_INFO_MI)}
                    onClick={() => {
                        onClose();
                        onDetailsSelected();
                    }}
                >
                    <ListItemIcon>
                        <Info fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t("detailsLbl")} />
                </MenuItem>
            )}
            {!isAdmin && canShare && (
                <SharingMenuItem
                    key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                    baseId={baseId}
                    onClose={onClose}
                    setSharingDlgOpen={setSharingDlgOpen}
                />
            )}
        </Hidden>,

        <MenuItem
            key={buildID(baseId, ids.MANAGE_TOOLS.ADD_TOOL_MI)}
            id={buildID(baseId, ids.MANAGE_TOOLS.ADD_TOOL_MI)}
            onClick={() => {
                onClose();
                onAddToolSelected();
            }}
        >
            <ListItemIcon>
                <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("addTool")} />
        </MenuItem>,

        allowEditing && (
            <MenuItem
                key={buildID(baseId, ids.MANAGE_TOOLS.EDIT_TOOL_MI)}
                id={buildID(baseId, ids.MANAGE_TOOLS.EDIT_TOOL_MI)}
                onClick={() => {
                    onClose();
                    onEditToolSelected();
                }}
            >
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("edit")} />
            </MenuItem>
        ),

        allowDeletes && (
            <MenuItem
                key={buildID(baseId, ids.MANAGE_TOOLS.DELETE_TOOL_MI)}
                id={buildID(baseId, ids.MANAGE_TOOLS.DELETE_TOOL_MI)}
                onClick={() => {
                    onClose();
                    onDeleteToolSelected();
                }}
            >
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("delete")} />
            </MenuItem>
        ),

        !isAdmin && (
            <MenuItem
                key={buildID(baseId, ids.MANAGE_TOOLS.REQUEST_TOOL_MI)}
                id={buildID(baseId, ids.MANAGE_TOOLS.REQUEST_TOOL_MI)}
                onClick={() => {
                    onClose();
                    onRequestToolSelected();
                }}
            >
                <ListItemIcon>
                    <Send fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("requestToolMI")} />
            </MenuItem>
        ),

        isMobile && (
            <MenuItem
                key={buildID(baseId, ids.MANAGE_TOOLS.FILTER_TOOLS_MI)}
                id={buildID(baseId, ids.MANAGE_TOOLS.FILTER_TOOLS_MI)}
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
    ];
}

export default function ToolsDotMenu({
    ButtonProps,
    canDelete,
    canEdit,
    getSelectedTools,
    ...props
}) {
    const { baseId, isSingleSelection, isAdmin } = props;
    const { t } = useTranslation("common");
    const selectedTools = getSelectedTools ? getSelectedTools() : null;
    const allowEditing =
        canEdit &&
        isSingleSelection &&
        (isWritable(selectedTools[0]?.permission) || isAdmin);
    const allowDeletes =
        canDelete &&
        selectedTools?.length > 0 &&
        (selectedTools.filter((tool) => !isWritable(tool.permission)).length ===
            0 ||
            isAdmin);

    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            buttonText={t("dotMenuText")}
            render={(onClose) => (
                <DotMenuItems
                    {...props}
                    onClose={onClose}
                    allowEditing={allowEditing}
                    allowDeletes={allowDeletes}
                />
            )}
        />
    );
}
