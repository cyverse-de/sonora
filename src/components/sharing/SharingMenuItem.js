/**
 * @author aramsey
 *
 * A menu item meant for controlling when the Sharing dialog opens
 */

import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Share } from "@mui/icons-material";

import ids from "./ids";
import { useTranslation } from "i18n";

function SharingMenuItem(props) {
    const { baseId, onClose, setSharingDlgOpen } = props;
    const { t } = useTranslation("sharing");

    return (
        <MenuItem
            id={buildID(baseId, ids.SHARING_MENU_ITEM)}
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
