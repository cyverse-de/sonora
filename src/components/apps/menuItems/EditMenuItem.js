import React from "react";

import { useRouter } from "next/router";

import { useTranslation } from "i18n";
import ids from "../ids";
import { getAppEditPath } from "../utils";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function EditMenuItem(props) {
    const { baseId, app, onClose } = props;

    const router = useRouter();
    const { t } = useTranslation("apps");

    const isWorkflow = app?.step_count > 1;

    return (
        <MenuItem
            id={buildID(baseId, ids.EDIT_MENU_ITEM)}
            onClick={() => {
                onClose();
                router.push(
                    getAppEditPath(app.system_id, app.id, app.version_id)
                );
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText
                primary={t(isWorkflow ? "editWorkflow" : "editApp")}
            />
        </MenuItem>
    );
}
