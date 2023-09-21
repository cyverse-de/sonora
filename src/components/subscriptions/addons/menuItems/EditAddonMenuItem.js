import React from "react";

import { useTranslation } from "i18n";
import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function EditSubscriptionMenuItem(props) {
    const { baseId, onEditSelected, onClose } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <MenuItem
            id={buildID(baseId, ids.EDIT_SUBSCRIPTION_MENU_ITEM)}
            onClick={() => {
                onEditSelected();
                onClose();
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("edit")} />
        </MenuItem>
    );
}
