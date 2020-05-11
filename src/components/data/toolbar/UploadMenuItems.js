/**
 * @author Sriram
 *
 * An array of upload related menu items.
 *
 */

import React from "react";

import ids from "../ids";
import intlData from "../messages";

import { injectIntl } from "react-intl";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";

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
    return [
        <label htmlFor={localUploadId}>
            <MenuItem
                id={build(uploadMenuId, ids.UPLOAD_MI)}
                onClick={onBrowseLocal ? onBrowseLocal : null}
            >
                <ListItemIcon>
                    <UploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={getMessage("browseLocal")} />
            </MenuItem>
        </label>,
        <MenuItem
            id={build(uploadMenuId, ids.IMPORT_MI)}
            onClick={() => {
                onImportFromURL();
                console.log("Import from URL");
            }}
        >
            <ListItemIcon>
                <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={getMessage("importUrl")} />
        </MenuItem>,
        <MenuItem
            id={build(uploadMenuId, ids.UPLOAD_QUEUE_MI)}
            onClick={() => {
                onUploadQueue();
            }}
        >
            <ListItemIcon>
                <QueueIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={getMessage("uploadQueue")} />
        </MenuItem>,
    ];
}

export default withI18N(injectIntl(UploadMenuItems), intlData);
