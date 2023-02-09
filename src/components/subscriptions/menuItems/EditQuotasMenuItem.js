import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import { EditOutlined } from "@material-ui/icons";
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
                <EditOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("editQuotas")} />
        </MenuItem>
    );
}
