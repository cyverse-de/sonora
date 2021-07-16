/**
 * @author sriram
 *
 * A Copy path menu item to use for Data
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Label } from "@material-ui/icons";
import ids from "../ids";

export default function CopyPathMenuItem(props) {
    const { baseId, onClose, onCopyPathSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={buildID(baseId, ids.COPY_PATH_MENU_ITEM)}
            id={buildID(baseId, ids.COPY_PATH_MENU_ITEM)}
            onClick={() => {
                onClose();
                onCopyPathSelected();
            }}
        >
            <ListItemIcon>
                <Label fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("copyPath")} />
        </MenuItem>
    );
}
