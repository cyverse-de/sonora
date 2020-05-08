/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import {
    CreateNewFolder,
    Delete as DeleteIcon,
    Description as MetadataIcon,
    Edit as EditIcon,
    GetApp as DownloadIcon,
    Info,
    Share,
} from "@material-ui/icons";

import ids from "../ids";
import messages from "../messages";
import { isWritable } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";

function DataDotMenu(props) {
    const {
        baseId,
        path,
        permission,
        onDetailsSelected,
        onDownloadSelected,
        onEditSelected,
        onMetadataSelected,
        onDeleteSelected,
        ButtonProps,
        refreshListing,
        detailsEnabled,
    } = props;
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);

    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    detailsEnabled && (
                        <MenuItem onClick={onDetailsSelected}>
                            <ListItemIcon>
                                <Info fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("details")} />
                        </MenuItem>
                    ),
                    isWritable(permission) && (
                        <MenuItem onClick={onCreateFolderClicked}>
                            <ListItemIcon>
                                <CreateNewFolder fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("folder")} />
                        </MenuItem>
                    ),
                    <MenuItem>
                        <ListItemIcon>
                            <Share fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={getMessage("share")} />
                    </MenuItem>,
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
            <CreateFolderDialog
                path={path}
                open={createFolderDlgOpen}
                onClose={onCreateFolderDlgClose}
                onFolderCreated={() => {
                    onCreateFolderDlgClose();
                    refreshListing();
                }}
            />
        </>
    );
}

export default withI18N(DataDotMenu, messages);
