/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import ids from "../ids";
import { isOwner, isWritable } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";

import { build, DotMenu } from "@cyverse-de/ui-lib";
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
    ListAlt,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

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
        onCreateHTFileSelected,
        onCreateMultiInputFileSelected,
    } = props;
    const { t } = useTranslation("data");
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
                            <ListItemText primary={t("details")} />
                        </MenuItem>
                    ),
                    detailsEnabled && (
                        <Divider
                            key={build(baseId, ids.DETAILS_MENU_ITEM_DIVIDER)}
                        />
                    ),
                    isWritable(permission) && [
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
                            <ListItemText primary={t("folder")} />
                        </MenuItem>,
                        <MenuItem
                            key={build(baseId, ids.CREATE_HT_FILE_MI)}
                            id={build(baseId, ids.CREATE_HT_FILE_MI)}
                            onClick={() => {
                                onClose();
                                onCreateHTFileSelected();
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("newHTAnalysisPathListFile")}
                            />
                        </MenuItem>,
                        <MenuItem
                            key={build(baseId, ids.CREATE_MULTI_INPUT_MI)}
                            id={build(baseId, ids.CREATE_MULTI_INPUT_MI)}
                            onClick={() => {
                                onClose();
                                onCreateMultiInputFileSelected();
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("newMultiInputPathListFile")}
                            />
                        </MenuItem>,
                    ],
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
                            <ListItemText primary={t("delete")} />
                        </MenuItem>
                    ),
                    <Divider
                        key={build(baseId, ids.UPLOAD_MENU_ITEM_DIVIDER)}
                    />,
                    isWritable(permission) && (
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
                        />
                    ),
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

export default DataDotMenu;
