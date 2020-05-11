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
    Info,
} from "@material-ui/icons";

import ids from "../ids";
import messages from "../messages";
import { isWritable } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";
import UploadMenuBtn from "./UploadMenuBtn";

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
                    <UploadMenuItems
                        localUploadId={localUploadId}
                        uploadMenuId={uploadMenuId}
                        onImportFromURL={() => {
                            console.log("Import from URL");
                        }}
                        onUploadQueue={() => {
                            setUploadDialogOpen(true);
                        }}
                    />,
                    isWritable(permission) &&
                        ((
                            <MenuItem onClick={onCreateFolderClicked}>
                                <ListItemIcon>
                                    <CreateNewFolder fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={getMessage("folder")} />
                            </MenuItem>
                        ),
                        (
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
                            </MenuItem>
                        )),
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
