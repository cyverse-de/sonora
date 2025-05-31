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
import announcePlanCannotShare from "./announcePlanCannotShare";
import { useTranslation } from "i18n";

function SharingMenuItem(props) {
    const { baseId, planCanShare, onClose, setSharingDlgOpen } = props;
    const { t } = useTranslation(["sharing", "common"]);

    return (
        <MenuItem
            id={buildID(baseId, ids.SHARING_MENU_ITEM)}
            onClick={() => {
                onClose();

                if (planCanShare) {
                    setSharingDlgOpen(true);
                } else {
                    announcePlanCannotShare(t);
                }
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
