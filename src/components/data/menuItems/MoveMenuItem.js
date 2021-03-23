import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import SyncAltIcon from "@material-ui/icons/SyncAlt";

import ids from "../ids";
import { useTranslation } from "i18n";

function MoveMenuItem(props) {
    const { baseId, onClose, onMoveSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={build(baseId, ids.MOVE_MENU_ITEM)}
            id={build(baseId, ids.MOVE_MENU_ITEM)}
            onClick={() => {
                onClose();
                onMoveSelected();
            }}
        >
            <ListItemIcon>
                <SyncAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("move")} />
        </MenuItem>
    );
}

export default MoveMenuItem;
