import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Extension } from "@mui/icons-material";

export default function EditAddonsMenuItem(props) {
    const { baseId, onEditAddonsSelected, onClose } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <MenuItem
            id={buildID(baseId, ids.ADDONS_MENU_ITEM)}
            onClick={() => {
                onEditAddonsSelected();
                onClose();
            }}
        >
            <ListItemIcon>
                <Extension fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("editAddons")} />
        </MenuItem>
    );
}
