import React from "react";

import { useRouter } from "next/router";

import { useTranslation } from "i18n";
import ids from "../ids";

import NavigationConstants from "common/NavigationConstants";
import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function EditVersionOrderMenuItem(props) {
    const { baseId, app, onClose } = props;

    const router = useRouter();
    const { t } = useTranslation("apps");

    return (
        <MenuItem
            id={buildID(baseId, ids.EDIT_APP_VERSION_ORDER_MENU_ITEM)}
            onClick={() => {
                onClose();
                router.push(
                    `/${NavigationConstants.APPS}/${app.system_id}/${app.id}/versions`
                );
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("editAppVersionOrder")} />
        </MenuItem>
    );
}
