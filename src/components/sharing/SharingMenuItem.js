/**
 * @author aramsey
 *
 * A menu item meant for controlling when the Sharing dialog opens
 */

import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { Share } from "@material-ui/icons";

import ids from "./ids";
import { useTranslation } from "i18n";

function SharingMenuItem(props) {
    const { baseId, onClose, setSharingDlgOpen } = props;
    const { t } = useTranslation("sharing");

    return (
        <MenuItem
            id={build(baseId, ids.SHARING_MENU_ITEM)}
            onClick={() => {
                onClose();
                setSharingDlgOpen(true);
            }}
        >
            <ListItemIcon>
                <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("share")} />
        </MenuItem>
    );
}
export default SharingMenuItem;
