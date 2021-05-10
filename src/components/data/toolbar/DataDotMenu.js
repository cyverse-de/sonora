/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import { useRouter } from "next/router";

import ids from "../ids";
import shareIds from "components/sharing/ids";
import { containsFolders, isOwner, isWritable } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";

import { useTranslation } from "i18n";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import MetadataMenuItem from "../menuItems/MetadataMenuItem";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import PublicLinksMenuItem from "../menuItems/PublicLinksMenuItem";
import DownloadMenuItem from "../menuItems/DownloadMenuItem";
import RenameMenuItem from "../menuItems/RenameMenuItem";
import MoveMenuItem from "../menuItems/MoveMenuItem";
import PathListAutomation from "../PathListAutomation";
import ResourceTypes from "components/models/ResourceTypes";

import constants from "../../../constants";

import {
    HT_ANALYSIS_PATH_LIST,
    MULTI_INPUT_PATH_LIST,
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
    Refresh,
    Send as RequestIcon,
    Description,
} from "@material-ui/icons";
import NavigationConstants from "common/NavigationConstants";
import TrashMenuItems from "./TrashMenuItems";
import ApplyBulkMetadataDialog from "components/metadata/ApplyBulkMetadataDialog";

function DataDotMenu(props) {
    const {
        baseId,
        path,
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
        setSharingDlgOpen,
        isSmall,
        onMetadataSelected,
        onPublicLinksSelected,
        onDownloadSelected,
        onRequestDOISelected,
        onRefreshSelected,
        inTrash,
        uploadEnabled,
        sharingEnabled,
        bagEnabled,
        handleEmptyTrash,
        handleDelete,
        handleRestore,
        onRenameSelected,
        onMoveSelected,
    } = props;

    const { t } = useTranslation(["data", "common"]);

    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const [pathListDlgOpen, setPathListDlgOpen] = useState(false);

    const [requestedInfoType, setRequestedInfoType] = useState();
    const [bulkMdDialogOpen, setBulkMdDialogOpen] = useState(false);

    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);

    const onBulkMdDialogClose = () => setBulkMdDialogOpen(false);
    const onApplyBulkMdClicked = () => setBulkMdDialogOpen(true);

    const isSelectionEmpty = selected?.length === 0;
    const selectedResources = getSelectedResources
        ? getSelectedResources()
        : null;

    const metadataMiEnabled = !inTrash && selected?.length === 1;
    const requestDoiEnabled =
        isOwner(selectedResources) && containsFolders(selectedResources);
    const moveToTrashEnabled =
        !inTrash && !isSelectionEmpty && isOwner(selectedResources);

    const publicLinkEnabled =
        !inTrash &&
        isOwner(selectedResources) &&
        !containsFolders(selectedResources);
    const downloadEnabled =
        !inTrash && !isSelectionEmpty && !containsFolders(selectedResources);
    const renameEnabled =
        !inTrash &&
        selected?.length === 1 &&
        isWritable(selectedResources[0]?.permission);
    const moveMiEnabled =
        !inTrash && !isSelectionEmpty && isOwner(selectedResources);
    const router = useRouter();
    const routeToFile = (id, path) => {
        router.push(
            `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${path}?type=${ResourceTypes.FILE}&resourceId=${id}`
        );
    };

    const applyBulkMetadataEnabled =
        metadataMiEnabled && selectedResources[0].type === ResourceTypes.FOLDER;

    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                buttonText={t("common:dotMenuText")}
                iconOnlyBreakpoint="sm"
                render={(onClose) => [
                    isSmall
                        ? [
                              <MenuItem
                                  key={build(baseId, ids.REFRESH_MENU_ITEM)}
                                  id={build(baseId, ids.REFRESH_MENU_ITEM)}
                                  onClick={() => {
                                      onClose();
                                      onRefreshSelected();
                                  }}
                              >
                                  <ListItemIcon>
                                      <Refresh fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={t("refresh")} />
                              </MenuItem>,
                              <Divider key={ids.REFRESH_MENU_ITEM_DIVIDER} />,
                              uploadEnabled && (
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
                              bagEnabled && (
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
                              sharingEnabled && (
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
                              metadataMiEnabled && [
                                  <MetadataMenuItem
                                      key={ids.METADATA_MI}
                                      baseId={baseId}
                                      resourceId={selected[0]}
                                      onClose={onClose}
                                      onMetadataSelected={onMetadataSelected}
                                  />,
                                  requestDoiEnabled && (
                                      <MenuItem
                                          key={build(
                                              baseId,
                                              ids.REQUEST_DOI_MI
                                          )}
                                          id={build(baseId, ids.REQUEST_DOI_MI)}
                                          onClick={() => {
                                              onClose();
                                              onRequestDOISelected();
                                          }}
                                      >
                                          <ListItemIcon>
                                              <RequestIcon fontSize="small" />
                                          </ListItemIcon>
                                          <ListItemText
                                              primary={t("requestDOI")}
                                          />
                                      </MenuItem>
                                  ),
                              ],

                              <Divider key={ids.UPLOAD_MENU_ITEM_DIVIDER} />,
                              uploadEnabled && (
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
                        : metadataMiEnabled && [
                              <MetadataMenuItem
                                  key={ids.METADATA_MI}
                                  baseId={baseId}
                                  resourceId={selected[0]}
                                  onClose={onClose}
                                  onMetadataSelected={onMetadataSelected}
                              />,
                              requestDoiEnabled && (
                                  <MenuItem
                                      key={build(baseId, ids.REQUEST_DOI_MI)}
                                      id={build(baseId, ids.REQUEST_DOI_MI)}
                                      onClick={() => {
                                          onClose();
                                          onRequestDOISelected();
                                      }}
                                  >
                                      <ListItemIcon>
                                          <RequestIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={t("requestDOI")} />
                                  </MenuItem>
                              ),
                              applyBulkMetadataEnabled && (
                                  <MenuItem
                                      key={build(baseId, "BULK")}
                                      id={build(baseId, ids.BULK)}
                                      onClick={() => {
                                          onClose();
                                          onApplyBulkMdClicked();
                                      }}
                                  >
                                      <ListItemIcon>
                                          <Description fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary="Apply Bulk Metadata" />
                                  </MenuItem>
                              ),
                              <Divider key={ids.METADATA_MENU_ITEM_DIVIDER} />,
                          ],

                    uploadEnabled && [
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
                    renameEnabled && (
                        <RenameMenuItem
                            key={build(baseId, ids.RENAME_MI)}
                            onRenameSelected={onRenameSelected}
                            baseId={baseId}
                            onClose={onClose}
                        />
                    ),
                    publicLinkEnabled && (
                        <PublicLinksMenuItem
                            key={build(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
                            onPublicLinksSelected={onPublicLinksSelected}
                            baseId={baseId}
                            onClose={onClose}
                        />
                    ),
                    downloadEnabled && (
                        <DownloadMenuItem
                            key={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
                            onDownloadSelected={onDownloadSelected}
                            baseId={baseId}
                            onClose={onClose}
                        />
                    ),
                    moveMiEnabled && (
                        <MoveMenuItem
                            key={build(baseId, ids.MOVE_MENU_ITEM)}
                            onMoveSelected={onMoveSelected}
                            baseId={baseId}
                            onClose={onClose}
                        />
                    ),
                    <Divider key={ids.DELETE_MENU_ITEM_DIVIDER} />,
                    moveToTrashEnabled && (
                        <DeleteMenuItem
                            key={ids.MOVE_TO_TRASH_MENU_ITEM}
                            baseId={baseId}
                            onClose={onClose}
                            onDeleteSelected={onDeleteSelected}
                        />
                    ),
                    inTrash && (
                        <TrashMenuItems
                            baseId={baseId}
                            selected={selected}
                            handleEmptyTrash={handleEmptyTrash}
                            handleDelete={handleDelete}
                            handleRestore={handleRestore}
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

            <ApplyBulkMetadataDialog
                open={bulkMdDialogOpen}
                handleClose={onBulkMdDialogClose}
                destFolder={selectedResources[0]?.path || ""}
            />

            <PathListAutomation
                open={pathListDlgOpen}
                title={t("createPathList")}
                requestedInfoType={requestedInfoType}
                baseId={build(baseId, ids.PATH_LIST_AUTO_DIALOG)}
                onClose={() => setPathListDlgOpen(false)}
                onCreatePathList={(id, path) => {
                    setPathListDlgOpen(false);
                    routeToFile(id, path);
                }}
                onCancel={() => setPathListDlgOpen(false)}
                startingPath={path}
            />
        </>
    );
}

export default DataDotMenu;
