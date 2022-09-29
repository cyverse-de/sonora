/**
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import { Delete as DeleteIcon } from "@material-ui/icons";

export default function DeleteMenuItem(props) {
    const { baseId, isDeleted, handleDelete, onClose } = props;

    const { t } = useTranslation("common");

    return (
        <MenuItem
            id={buildID(baseId, ids.DELETE)}
            onClick={() => {
                handleDelete();
                onClose();
            }}
        >
            <ListItemIcon>
                <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t(isDeleted ? "restore" : "delete")} />
        </MenuItem>
    );
}
