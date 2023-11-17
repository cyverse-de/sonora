import React from "react";

import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import { MenuBook } from "@mui/icons-material";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useTranslation } from "i18n";

export default function DocMenuItem(props) {
    const { baseId, onClose, onDocSelected } = props;
    const { t } = useTranslation("apps");
    return (
        <MenuItem
            key={buildID(baseId, ids.DOCUMENTATION)}
            onClick={() => {
                onClose();
                onDocSelected();
            }}
        >
            <ListItemIcon>
                <MenuBook fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("documentation")} />
        </MenuItem>
    );
}
