/**
 * @author sriram
 *
 * A common CopyLink menu item to use across Data and Apps
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";
import ids from "./ids";

export default function CopyLinkMenuItem(props) {
    const { baseId, onClose, onCopyLinkSelected } = props;
    const { t } = useTranslation("util");

    return (
        <MenuItem
            key={build(baseId, ids.COPY_LINK_MENU_ITEM)}
            id={build(baseId, ids.COPY_LINK_MENU_ITEM)}
            onClick={() => {
                onClose();
                onCopyLinkSelected();
            }}
        >
            <ListItemIcon>
                <FileCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("copyLink")} />
        </MenuItem>
    );
}
