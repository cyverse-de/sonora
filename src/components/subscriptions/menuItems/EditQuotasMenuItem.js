import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

import { Storage } from "@mui/icons-material";
export default function EditQuotasMenuItem(props) {
    const { baseId, onEditSelected, onClose } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <MenuItem
            id={buildID(baseId, ids.EDIT_QUOTAS_MENU_ITEM)}
            onClick={() => {
                onEditSelected();
                onClose();
            }}
        >
            <ListItemIcon>
                <Storage fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("editQuotas")} />
        </MenuItem>
    );
}
