/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import { useRouter } from "next/router";

import ids from "../ids";
import shareIds from "components/sharing/ids";
import { isOwner, isWritable, containsFolders } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";

import { useTranslation } from "i18n";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import PublicLinksMenuItem from "../menuItems/PublicLinksMenuItem";
import PathListAutomation from "../PathListAutomation";
import DEDialog from "components/utils/DEDialog";
import ResourceTypes from "components/models/ResourceTypes";

import constants from "../../../constants";

import {
    MULTI_INPUT_PATH_LIST,
    HT_ANALYSIS_PATH_LIST,
} from "serviceFacades/filesystem";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";
import {
    CreateNewFolder,
    ListAlt,
    Queue as AddToBagIcon,
} from "@material-ui/icons";
import NavigationConstants from "common/NavigationConstants";

function DataDotMenu(props) {
    const {
        baseId,
        path,
        permission,
        onDetailsSelected,
        onDeleteSelected,
        onAddToBagSelected,
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
        canShare,
        setSharingDlgOpen,
        isSmall,
        onPublicLinksSelected,
    } = props;

    const { t } = useTranslation("data");

    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const [pathListDlgOpen, setPathListDlgOpen] = useState(false);
    const [requestedInfoType, setRequestedInfoType] = useState();

    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);

    const isSelectionEmpty = selected?.length === 0;
    const selectedResources = getSelectedResources
        ? getSelectedResources()
        : null;
    const deleteMiEnabled = !isSelectionEmpty && isOwner(selectedResources);
    const router = useRouter();
    const routeToFile = (id, path) => {
        router.push(
            `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${path}?type=${ResourceTypes.FILE}&resourceId=${id}`
        );
    };

    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    isSmall
                        ? [
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
                                      <ListItemText primary={t("folder")} />
                                  </MenuItem>
                              ),
                              detailsEnabled && (
                                  <DetailsMenuItem
                                      key={build(baseId, ids.DETAILS_MENU_ITEM)}
                                      baseId={baseId}
                                      onClose={onClose}
                                      onDetailsSelected={onDetailsSelected}
                                  />
                              ),
                              selected && selected.length > 0 && (
                                  <MenuItem
                                      key={build(baseId, ids.ADD_TO_BAG_MI)}
                                      id={build(baseId, ids.ADD_TO_BAG_MI)}
                                      onClick={() => {
                                          onClose();
                                          onAddToBagSelected();
                                      }}
                                  >
                                      <ListItemIcon>
                                          <AddToBagIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={t("addToBag")} />
                                  </MenuItem>
                              ),
                              canShare && (
                                  <SharingMenuItem
                                      key={build(
                                          baseId,
                                          shareIds.SHARING_MENU_ITEM
                                      )}
                                      baseId={baseId}
                                      onClose={onClose}
                                      setSharingDlgOpen={setSharingDlgOpen}
                                  />
                              ),
                              deleteMiEnabled && (
                                  <DeleteMenuItem
                                      key={build(baseId, ids.DELETE_MENU_ITEM)}
                                      baseId={baseId}
                                      onClose={onClose}
                                      onDeleteSelected={onDeleteSelected}
                                  />
                              ),
                              <Divider
                                  key={build(
                                      baseId,
                                      ids.UPLOAD_MENU_ITEM_DIVIDER
                                  )}
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
                          ]
                        : deleteMiEnabled && (
                              <DeleteMenuItem
                                  key={build(baseId, ids.DELETE_MENU_ITEM)}
                                  baseId={baseId}
                                  onClose={onClose}
                                  onDeleteSelected={onDeleteSelected}
                              />
                          ),
                    isWritable(permission) && [
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
                        <MenuItem
                            key={build(baseId, ids.AUTO_CREATE_HT_FILE_MI)}
                            id={build(baseId, ids.AUTO_CREATE_HT_FILE_MI)}
                            onClick={() => {
                                setRequestedInfoType(HT_ANALYSIS_PATH_LIST);
                                onClose();
                                console.log("menu clicked");
                                setPathListDlgOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("automateCreateHtPathList")}
                            />
                        </MenuItem>,
                        <MenuItem
                            key={build(baseId, ids.AUTO_CREATE_MULTI_INPUT_MI)}
                            id={build(baseId, ids.AUTO_CREATE_MULTI_INPUT_MI)}
                            onClick={() => {
                                setRequestedInfoType(MULTI_INPUT_PATH_LIST);
                                onClose();
                                console.log("menu clicked");
                                setPathListDlgOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("automateCreateMultiInput")}
                            />
                        </MenuItem>,
                    ],
                    isOwner(selectedResources) &&
                        !containsFolders(selectedResources) && (
                            <PublicLinksMenuItem
                                key={build(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
                                onPublicLinksSelected={onPublicLinksSelected}
                                baseId={baseId}
                                onClose={onClose}
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
            <DEDialog
                baseId={build(baseId, ids.PATH_LIST_AUTO_DIALOG)}
                open={pathListDlgOpen}
                onClose={() => setPathListDlgOpen(false)}
                title={t("createPathList")}
            >
                <PathListAutomation
                    requestedInfoType={requestedInfoType}
                    baseId={build(baseId, ids.PATH_LIST_AUTO_DIALOG)}
                    onCreatePathList={(id, path) => {
                        setPathListDlgOpen(false);
                        routeToFile(id, path);
                    }}
                    onCancel={() => setPathListDlgOpen(false)}
                    startingPath={path}
                />
            </DEDialog>
        </>
    );
}

export default DataDotMenu;
