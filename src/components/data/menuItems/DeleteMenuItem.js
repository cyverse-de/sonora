import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

import ids from "../ids";
import { useTranslation } from "i18n";

function DeleteMenuItem(props) {
    const { baseId, onClose, onDeleteSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={build(baseId, ids.MOVE_TO_TRASH_MENU_ITEM)}
            id={build(baseId, ids.MOVE_TO_TRASH_MENU_ITEM)}
            onClick={() => {
                onClose();
                onDeleteSelected();
            }}
        >
            <ListItemIcon>
                <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("moveToTrash")} />
        </MenuItem>
    );
}

export default DeleteMenuItem;
