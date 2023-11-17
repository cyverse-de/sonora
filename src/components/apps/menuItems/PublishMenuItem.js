import React from "react";

import buildID from "components/utils/DebugIDUtil";
import PublicIcon from "@mui/icons-material/Public";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useTranslation } from "i18n";
import ids from "../ids";

export default function PublishMenuItem(props) {
    const { baseId, onClose, onPublishSelected } = props;
    const { t } = useTranslation("apps");
    return (
        <MenuItem
            id={buildID(baseId, ids.PUBLISH_MENU_ITEM)}
            onClick={() => {
                onClose();
                onPublishSelected();
            }}
        >
            <ListItemIcon>
                <PublicIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("publish")} />
        </MenuItem>
    );
}
