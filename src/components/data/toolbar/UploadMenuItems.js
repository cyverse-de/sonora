/**
 * @author Sriram
 *
 * An array of upload related menu items.
 *
 */

import React from "react";

import ids from "../ids";

import { useTranslation } from "react-i18next";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import buildID from "components/utils/DebugIDUtil";

import UploadIcon from "@material-ui/icons/CloudUpload";
import QueueIcon from "@material-ui/icons/Sort";

function UploadMenuItems(props) {
    const {
        localUploadId,
        uploadMenuId,
        onBrowseLocal,
        onImportFromURL,
        onUploadQueue,
    } = props;
    const { t } = useTranslation("data");
    return [
        <label htmlFor={localUploadId}>
            <MenuItem
                id={buildID(uploadMenuId, ids.UPLOAD_MI)}
                key={buildID(uploadMenuId, ids.UPLOAD_MI)}
                onClick={onBrowseLocal ? onBrowseLocal : null}
            >
                <ListItemIcon>
                    <UploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("browseLocal")} />
            </MenuItem>
        </label>,
        <MenuItem
            id={buildID(uploadMenuId, ids.IMPORT_MI)}
            key={buildID(uploadMenuId, ids.IMPORT_MI)}
            onClick={onImportFromURL}
        >
            <ListItemIcon>
                <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("importUrl")} />
        </MenuItem>,
        <MenuItem
            key={buildID(uploadMenuId, ids.UPLOAD_QUEUE_MI)}
            id={buildID(uploadMenuId, ids.UPLOAD_QUEUE_MI)}
            onClick={() => {
                onUploadQueue();
            }}
        >
            <ListItemIcon>
                <QueueIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("uploadQueue")} />
        </MenuItem>,
    ];
}

export default UploadMenuItems;
