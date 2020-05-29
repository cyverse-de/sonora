/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import ids from "../ids";
import messages from "../messages";
import { isOwner, isWritable } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";
import {
    CreateNewFolder,
    Delete as DeleteIcon,
    Info,
} from "@material-ui/icons";

function DataDotMenu(props) {
    const {
        baseId,
        path,
        permission,
        onDetailsSelected,
        onDeleteSelected,
        ButtonProps,
        refreshListing,
        detailsEnabled,
        uploadMenuId,
        localUploadId,
        setUploadDialogOpen,
        setImportDialogOpen,
        selected,
        getSelectedResources,
    } = props;
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);
    const isSelectionEmpty = selected?.length === 0;
    const selectedResources = getSelectedResources
        ? getSelectedResources()
        : null;
    const deleteMiEnabled = !isSelectionEmpty && isOwner(selectedResources);
    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    detailsEnabled && (
                        <MenuItem
                            key={build(baseId, ids.DETAILS_MENU_ITEM)}
                            id={build(baseId, ids.DETAILS_MENU_ITEM)}
                            onClick={() => {
                                onClose();
                                onDetailsSelected();
                            }}
                        >
                            <ListItemIcon>
                                <Info fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("details")} />
                        </MenuItem>
                    ),
                    detailsEnabled && (
                        <Divider
                            key={build(baseId, ids.DETAILS_MENU_ITEM_DIVIDER)}
                        />
                    ),
                    isWritable(permission) && (
                        <MenuItem
                            key={build(baseId, ids.CREATE_FOLDER_MI)}
                            id={build(baseId, ids.CREATE_FOLDER_MI)}
                            onClick={() => {
                                onClose();
                                onCreateFolderClicked();
                            }}
                        >
                            <ListItemIcon>
                                <CreateNewFolder fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("folder")} />
                        </MenuItem>
                    ),
                    deleteMiEnabled && (
                        <MenuItem
                            key={build(baseId, ids.DELETE_MENU_ITEM)}
                            id={build(baseId, ids.DELETE_MENU_ITEM)}
                            onClick={() => {
                                onClose();
                                onDeleteSelected();
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={getMessage("delete")} />
                        </MenuItem>
                    ),
                    <Divider
                        key={build(baseId, ids.UPLOAD_MENU_ITEM_DIVIDER)}
                    />,
                    <UploadMenuItems
                        key={build(baseId, ids.UPLOAD_MENU_ITEM)}
                        localUploadId={localUploadId}
                        uploadMenuId={uploadMenuId}
                        onBrowseLocal={onClose}
                        onImportFromURL={() => {
                            onClose();
                            setImportDialogOpen(true);
                        }}
                        onUploadQueue={() => {
                            onClose();
                            setUploadDialogOpen(true);
                        }}
                    />,
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
