import React from "react";

import PublicIcon from "@material-ui/icons/Public";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

export default function PublishMenuItem(props) {
    const { onClose, onPublishSelected } = props;
    const { t } = useTranslation("apps");
    return (
        <MenuItem
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
