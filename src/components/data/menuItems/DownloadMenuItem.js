import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

import ids from "../ids";
import { useTranslation } from "i18n";

function DeleteMenuItem(props) {
    const { baseId, onClose, onDownloadSelected } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            id={buildID(baseId, ids.DOWNLOAD_MENU_ITEM)}
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
