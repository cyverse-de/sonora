import React from "react";

import { useRouter } from "next/router";

import { useTranslation } from "i18n";
import ids from "../ids";
import { getAppEditPath } from "../utils";

import { build } from "@cyverse-de/ui-lib";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

export default function EditMenuItem(props) {
    const { baseId, app, onClose } = props;

    const router = useRouter();
    const { t } = useTranslation("common");

    return (
        <MenuItem
            id={build(baseId, ids.EDIT_MENU_ITEM)}
            onClick={() => {
                onClose();
                router.push(getAppEditPath(app.system_id, app.id));
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("edit")} />
        </MenuItem>
    );
}
