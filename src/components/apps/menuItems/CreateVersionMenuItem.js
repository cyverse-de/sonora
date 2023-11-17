import React from "react";

import { useRouter } from "next/router";

import { useTranslation } from "i18n";
import ids from "../ids";
import { getAppVersionCreatePath } from "../utils";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function CreateVersionMenuItem(props) {
    const { baseId, app, onClose } = props;

    const router = useRouter();
    const { t } = useTranslation("apps");

    return (
        <MenuItem
            id={buildID(baseId, ids.CREATE_APP_VERSION_MENU_ITEM)}
            onClick={() => {
                onClose();
                router.push(
                    getAppVersionCreatePath(
                        app.system_id,
                        app.id,
                        app.version_id
                    )
                );
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("createAppVersion")} />
        </MenuItem>
    );
}
