import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import ids from "../ids";
import { useTranslation } from "i18n";

function MoveMenuItem(props) {
    const { baseId, onClose, onMoveSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={buildID(baseId, ids.MOVE_MENU_ITEM)}
            id={buildID(baseId, ids.MOVE_MENU_ITEM)}
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
