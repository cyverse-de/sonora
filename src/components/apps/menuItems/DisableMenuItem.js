/**
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

import { Block as DisableIcon } from "@mui/icons-material";

export default function DisableMenuItem(props) {
    const { baseId, isDisabled, handleDisable, onClose } = props;

    const { t } = useTranslation("common");

    return (
        <MenuItem
            id={buildID(baseId, ids.DISABLE)}
            onClick={() => {
                handleDisable();
                onClose();
            }}
        >
            <ListItemIcon>
                <DisableIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t(isDisabled ? "enable" : "disable")} />
        </MenuItem>
    );
}
