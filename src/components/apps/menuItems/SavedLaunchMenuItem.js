import React from "react";

import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import { FastForward } from "@material-ui/icons";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

export default function SavedLaunchMenuItem(props) {
    const { baseId, onClose, onSavedLaunchSelected } = props;
    const { t } = useTranslation("apps");
    return (
        <MenuItem
            key={buildID(baseId, ids.SAVED_LAUNCH_MENU_ITEM)}
            onClick={() => {
                onClose();
                onSavedLaunchSelected();
            }}
        >
            <ListItemIcon>
                <FastForward fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("savedLaunch")} />
        </MenuItem>
    );
}
