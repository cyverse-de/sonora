/**
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { List as MetadataIcon } from "@material-ui/icons";

function MetadataMenuItem(props) {
    const { baseId, resourceId, onClose, onMetadataSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            id={build(baseId, ids.METADATA_MI)}
            onClick={() => {
                onClose();
                onMetadataSelected(resourceId);
            }}
        >
            <ListItemIcon>
                <MetadataIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("metadata")} />
        </MenuItem>
    );
}

export default MetadataMenuItem;
