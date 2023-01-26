import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

export default function EditMenuItem(props) {
    const { baseId, onEditSelected, onClose } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <MenuItem
            id={buildID(baseId, ids.EDIT_MENU_ITEM)}
            onClick={() => {
                onEditSelected();
                onClose();
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("editSubscription")} />
        </MenuItem>
    );
}
