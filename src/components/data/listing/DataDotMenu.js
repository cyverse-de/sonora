/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React from "react";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    GetApp as DownloadIcon,
    Description as MetadataIcon,
} from "@material-ui/icons";

import ids from "../ids";
import messages from "../messages";

function DataDotMenu(props) {
    const {
        baseId,
        onDownloadSelected,
        onEditSelected,
        onMetadataSelected,
        onDeleteSelected,
    } = props;
    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={{ size: "small" }}
            render={(onClose) => [
                <MenuItem
                    key={build(baseId, ids.downloadMI)}
                    id={build(baseId, ids.downloadMI)}
                    onClick={(event) => {
                        onClose(event);
                        onDownloadSelected();
                    }}
                >
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getMessage("download")} />
                </MenuItem>,
                <MenuItem
                    key={build(baseId, ids.editMI)}
                    id={build(baseId, ids.editMI)}
                    onClick={() => {
                        onClose();
                        onEditSelected();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getMessage("editFile")} />
                </MenuItem>,
                <MenuItem
                    key={build(baseId, ids.metadataMI)}
                    id={build(baseId, ids.metadataMI)}
                    onClick={() => {
                        onClose();
                        onMetadataSelected();
                    }}
                >
                    <ListItemIcon>
                        <MetadataIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getMessage("metadata")} />
                </MenuItem>,
                <MenuItem
                    key={build(baseId, ids.deleteMI)}
                    id={build(baseId, ids.deleteMI)}
                    onClick={() => {
                        onClose();
                        onDeleteSelected();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={getMessage("delete")} />
                </MenuItem>,
            ]}
        />
    );
}

export default withI18N(DataDotMenu, messages);
