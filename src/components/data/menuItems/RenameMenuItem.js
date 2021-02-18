import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { Edit } from "@material-ui/icons";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

import ids from "../ids";

function RenameMenuItem(props) {
    const { baseId, onRenameSelected, onClose } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            id={build(baseId, ids.RENAME_MI)}
            onClick={() => {
                onClose();
                onRenameSelected();
            }}
        >
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("rename")} />
        </MenuItem>
    );
}

export default RenameMenuItem;
