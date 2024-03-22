/**
 * @author Sriram
 *
 * An array of upload related menu items.
 *
 */

import React from "react";

import ids from "../ids";

import { useTranslation } from "i18n";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

import buildID from "components/utils/DebugIDUtil";

import UploadIcon from "@mui/icons-material/CloudUpload";
import QueueIcon from "@mui/icons-material/Sort";

const BrowseLocalLabel = ({ localUploadId, ...props }) => (
    <label htmlFor={localUploadId} {...props} />
);

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
        <MenuItem
            id={buildID(uploadMenuId, ids.UPLOAD_MI)}
            key={buildID(uploadMenuId, ids.UPLOAD_MI)}
            onClick={onBrowseLocal ? onBrowseLocal : null}
        >
            <ListItemIcon>
                <UploadIcon fontSize="small" />
            </ListItemIcon>
            <BrowseLocalLabel localUploadId={localUploadId}>
                <ListItemText primary={t("browseLocal")} />
            </BrowseLocalLabel>
        </MenuItem>,
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
