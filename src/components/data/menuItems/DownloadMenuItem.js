import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { CloudDownload } from "@material-ui/icons";

import ids from "../ids";
import { useTranslation } from "i18n";

function DeleteMenuItem(props) {
    const { baseId, onClose, onDownloadSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
            id={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
            onClick={() => {
                onClose();
                onDownloadSelected();
            }}
        >
            <ListItemIcon>
                <CloudDownload fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("download")} />
        </MenuItem>
    );
}

export default DeleteMenuItem;
