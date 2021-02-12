/**
 * @author sriram
 *
 * An array of trash related menu items.
 *
 */
import React from "react";

import ids from "../ids";

import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import {
    DeleteForever,
    RestoreFromTrash,
    DeleteSweep,
} from "@material-ui/icons";

export default function TrashMenuItems(props) {
    const {
        baseId,
        selected,
        handleDelete,
        handleRestore,
        handleEmptyTrash,
    } = props;
    const { t } = useTranslation("data");
    return [
        selected?.length > 0 && (
            <MenuItem
                id={build(baseId, ids.DELETE_MENU_ITEM)}
                key={build(baseId, ids.DELETE_MENU_ITEM)}
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
                id={build(baseId, ids.RESTORE_MENU_ITEM)}
                key={build(baseId, ids.RESTORE_MENU_ITEM)}
                onClick={() => handleRestore()}
            >
                <ListItemIcon>
                    <RestoreFromTrash fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("restore")} />
            </MenuItem>
        ),
        <MenuItem
            id={build(baseId, ids.EMPTY_TRASH_MENU_ITEM)}
            key={build(baseId, ids.EMPTY_TRASH_MENU_ITEM)}
            onClick={handleEmptyTrash}
        >
            <ListItemIcon>
                <DeleteSweep fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("emptyTrash")} />
        </MenuItem>,
    ];
}
