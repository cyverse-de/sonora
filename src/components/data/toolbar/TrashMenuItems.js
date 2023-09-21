/**
 * @author sriram
 *
 * An array of trash related menu items.
 *
 */
import React from "react";

import ids from "../ids";

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import {
    DeleteForever,
    RestoreFromTrash,
    DeleteSweep,
} from "@mui/icons-material";

export default function TrashMenuItems(props) {
    const { baseId, selected, handleDelete, handleRestore, handleEmptyTrash } =
        props;
    const { t } = useTranslation("data");
    return [
        selected?.length > 0 && (
            <MenuItem
                id={buildID(baseId, ids.DELETE_MENU_ITEM)}
                key={buildID(baseId, ids.DELETE_MENU_ITEM)}
                onClick={handleDelete}
            >
                <ListItemIcon>
                    <DeleteForever fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("delete")} />
            </MenuItem>
        ),
        selected?.length > 0 && (
            <MenuItem
                id={buildID(baseId, ids.RESTORE_MENU_ITEM)}
                key={buildID(baseId, ids.RESTORE_MENU_ITEM)}
                onClick={() => handleRestore()}
            >
                <ListItemIcon>
                    <RestoreFromTrash fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("restore")} />
            </MenuItem>
        ),
        <MenuItem
            id={buildID(baseId, ids.EMPTY_TRASH_MENU_ITEM)}
            key={buildID(baseId, ids.EMPTY_TRASH_MENU_ITEM)}
            onClick={handleEmptyTrash}
        >
            <ListItemIcon>
                <DeleteSweep fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("emptyTrash")} />
        </MenuItem>,
    ];
}
