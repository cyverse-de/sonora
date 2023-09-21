import React from "react";

import { useTranslation } from "i18n";
import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function EditSubscriptionMenuItem(props) {
    const { baseId, onDeleteSelected, onClose } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <MenuItem
            id={buildID(baseId, ids.ADDONS.DELETE_MENU_ITEM)}
            onClick={() => {
                onDeleteSelected();
                onClose();
            }}
        >
            <ListItemIcon>
                <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("deleteAddon")} />
        </MenuItem>
    );
}
