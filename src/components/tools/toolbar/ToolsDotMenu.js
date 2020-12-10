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

import { build, DotMenu } from "@cyverse-de/ui-lib";

import {
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";

import { Add, Info, Edit } from "@material-ui/icons";

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
        allowEditing,
    } = props;

    const { t } = useTranslation("tools");

    return [
        <Hidden mdUp>
            {isSingleSelection && (
                <MenuItem
                    key={build(baseId, ids.MANAGE_TOOLS.TOOL_INFO_MI)}
                    id={build(baseId, ids.MANAGE_TOOLS.TOOL_INFO_MI)}
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
            {canShare && (
                <SharingMenuItem
                    key={build(baseId, shareIds.SHARING_MENU_ITEM)}
                    baseId={baseId}
                    onClose={onClose}
                    setSharingDlgOpen={setSharingDlgOpen}
                />
            )}
        </Hidden>,
        <MenuItem
            key={build(baseId, ids.MANAGE_TOOLS.ADD_TOOL_MI)}
            id={build(baseId, ids.MANAGE_TOOLS.ADD_TOOL_MI)}
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
                key={build(baseId, ids.MANAGE_TOOLS.EDIT_TOOL_MI)}
                id={build(baseId, ids.MANAGE_TOOLS.EDIT_TOOL_MI)}
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
    ];
}

export default function ToolsDotMenu({
    ButtonProps,
    canShare,
    setSharingDlgOpen,
    onEditToolSelected,
    ...props
}) {
    const {
        baseId,
        isSingleSelection,
        onDetailsSelected,
        onAddToolSelected,
    } = props;
    const selectedTools = getSelectedTools ? getSelectedTools() : null;
    const allowEditing =
        isSingleSelection &&
        selectedTools &&
        selectedTools.length > 0 &&
        selectedTools[0].permission === "own";
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => (
                <DotMenuItems
                    isSingleSelection={isSingleSelection}
                    onClose={onClose}
                    onDetailsSelected={onDetailsSelected}
                    canShare={canShare}
                    setSharingDlgOpen={setSharingDlgOpen}
                    onAddToolSelected={onAddToolSelected}
                    onEditToolSelected={onEditToolSelected}
                    allowEditing={allowEditing}
                />
            )}
        />
    );
}
