import React from "react";

import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import { FastForward } from "@material-ui/icons";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

export default function QLMenuItem(props) {
    const { baseId, onClose, onQLSelected } = props;
    const { t } = useTranslation("apps");
    return (
        <MenuItem
            key={buildID(baseId, ids.QL_MENU_ITEM)}
            onClick={() => {
                onClose();
                onQLSelected();
            }}
        >
            <ListItemIcon>
                <FastForward fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("quickLaunch")} />
        </MenuItem>
    );
}
