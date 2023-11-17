import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Link } from "@mui/icons-material";

import ids from "../ids";
import { useTranslation } from "i18n";

export default function PublicLinksMenuItem(props) {
    const { baseId, onClose, onPublicLinksSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={buildID(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
            id={buildID(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
            onClick={() => {
                onClose();
                onPublicLinksSelected();
            }}
        >
            <ListItemIcon>
                <Link fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("publicLinks")} />
        </MenuItem>
    );
}
