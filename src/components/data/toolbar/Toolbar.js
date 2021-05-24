/**
 * @author aramsey
 *
 * A component that acts as a header to the data listing view.
 * It contains the primary actions a user would want to accomplish with
 * data and also allows toggling the table or grid view.
 */

import React, { useState } from "react";

import { useTranslation } from "i18n";

import DataDotMenu from "./DataDotMenu";
import UploadMenuBtn from "./UploadMenuBtn";
import Navigation from "./Navigation";

import { useConfig } from "contexts/config";

import ids from "../ids";
import styles from "../styles";
import CreateFolderDialog from "../CreateFolderDialog";
import { isOwner, isWritable, isPathInTrash } from "../utils";
import SharingButton from "components/sharing/SharingButton";

import { build } from "@cyverse-de/ui-lib";

import {
    Button,
    Hidden,
    makeStyles,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import {
    CreateNewFolder,
    Info,
    Queue as AddToBagIcon,
    Refresh,
} from "@material-ui/icons";
import { TrashMenu } from "./TrashMenu";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

const useStyles = makeStyles(styles);

function DataToolbar(props) {
    const classes = useStyles();
    const {
        baseId,
        path,
        selected,
        getSelectedResources,
        permission,
        refreshListing,
        onDeleteSelected,
        detailsEnabled,
        onDetailsSelected,
        onAddToBagSelected,
        handlePathChange,
        handleDataNavError,
        setImportDialogOpen,
        setUploadDialogOpen,
        localUploadId,
        uploadMenuId,
        onCreateFileSelected,
        setSharingDlgOpen,
        onMetadataSelected,
        onPublicLinksSelected,
        toolbarVisibility,
        onDownloadSelected,
        onRequestDOISelected,
        onRestoreSelected,
        onEmptyTrashSelected,
        onRefreshSelected,
        onRenameSelected,
        onMoveSelected,
    } = props;

    const { t } = useTranslation("data");
    const [config] = useConfig();
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [emptyTrashConfirmOpen, setEmptyTrashConfirmOpen] = useState(false);
    const selectedResources = getSelectedResources();
    const canShare = isOwner(selectedResources);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const inTrash = isPathInTrash(path, config?.irods?.trash_path);
    const uploadEnabled = !inTrash && isWritable(permission);
    const sharingEnabled = !inTrash && canShare;
    const bagEnabled = !inTrash && selected && selected.length > 0;
    const hasDotMenu =
        (selectedResources && selectedResources.length > 0 && !inTrash) ||
        (isWritable(permission) && !inTrash) ||
        isSmall;

    let toolbarId = build(baseId, ids.TOOLBAR);
    return (
        <Toolbar style={{ padding: 0 }}>
            <Navigation
                path={path}
                handleDataNavError={handleDataNavError}
                handlePathChange={handlePathChange}
                baseId={toolbarId}
            />
            <div className={classes.divider} />
            {toolbarVisibility && (
                <>
                    <Hidden smDown>
                        <Button
                            id={build(toolbarId, ids.REFRESH_BTN)}
                            variant="outlined"
                            size="small"
                            disableElevation
                            color="primary"
                            onClick={onRefreshSelected}
                            className={classes.button}
                            startIcon={<Refresh />}
                        >
                            <Hidden xsDown>{t("refresh")}</Hidden>
                        </Button>
                        {detailsEnabled && (
                            <Button
                                id={build(toolbarId, ids.DETAILS_BTN)}
                                variant="outlined"
                                size="small"
                                disableElevation
                                color="primary"
                                onClick={onDetailsSelected}
                                className={classes.button}
                                startIcon={<Info />}
                            >
                                <Hidden xsDown>{t("details")}</Hidden>
                            </Button>
                        )}
                        {uploadEnabled && (
                            <>
                                <Button
                                    id={build(toolbarId, ids.CREATE_BTN)}
                                    variant="outlined"
                                    size="small"
                                    disableElevation
                                    color="primary"
                                    onClick={onCreateFolderClicked}
                                    className={classes.button}
                                    startIcon={<CreateNewFolder />}
                                >
                                    <Hidden xsDown>{t("folder")}</Hidden>
                                </Button>
                                <UploadMenuBtn
                                    uploadMenuId={uploadMenuId}
                                    localUploadId={localUploadId}
                                    path={path}
                                    setUploadDialogOpen={setUploadDialogOpen}
                                    setImportDialogOpen={setImportDialogOpen}
                                />
                            </>
                        )}
                        {bagEnabled && (
                            <Button
                                id={build(toolbarId, ids.ADD_TO_BAG_BTN)}
                                variant="outlined"
                                size="small"
                                disableElevation
                                color="primary"
                                onClick={onAddToBagSelected}
                                startIcon={<AddToBagIcon />}
                            >
                                <Hidden xsDown>{t("addToBag")}</Hidden>
                            </Button>
                        )}
                        {sharingEnabled && (
                            <SharingButton
                                size="small"
                                baseId={toolbarId}
                                setSharingDlgOpen={setSharingDlgOpen}
                            />
                        )}
                    </Hidden>
                    {inTrash && !isSmall && (
                        <TrashMenu
                            baseId={baseId}
                            selected={selected}
                            handleEmptyTrash={() =>
                                setEmptyTrashConfirmOpen(true)
                            }
                            handleDelete={() => setDeleteConfirmOpen(true)}
                            handleRestore={onRestoreSelected}
                        />
                    )}

                    {hasDotMenu && (
                        <DataDotMenu
                            baseId={toolbarId}
                            path={path}
                            onDeleteSelected={onDeleteSelected}
                            onCreateFolderSelected={onCreateFolderClicked}
                            onDetailsSelected={onDetailsSelected}
                            onAddToBagSelected={onAddToBagSelected}
                            permission={permission}
                            refreshListing={refreshListing}
                            detailsEnabled={detailsEnabled}
                            uploadMenuId={uploadMenuId}
                            localUploadId={localUploadId}
                            setUploadDialogOpen={setUploadDialogOpen}
                            setImportDialogOpen={setImportDialogOpen}
                            getSelectedResources={getSelectedResources}
                            selected={selected}
                            onCreateFileSelected={onCreateFileSelected}
                            canShare={canShare}
                            setSharingDlgOpen={setSharingDlgOpen}
                            isSmall={isSmall}
                            onMetadataSelected={onMetadataSelected}
                            onPublicLinksSelected={onPublicLinksSelected}
                            onDownloadSelected={onDownloadSelected}
                            onRequestDOISelected={onRequestDOISelected}
                            inTrash={inTrash}
                            onRefreshSelected={onRefreshSelected}
                            uploadEnabled={uploadEnabled}
                            sharingEnabled={sharingEnabled}
                            bagEnabled={bagEnabled}
                            handleEmptyTrash={() =>
                                setEmptyTrashConfirmOpen(true)
                            }
                            handleDelete={() => setDeleteConfirmOpen(true)}
                            handleRestore={onRestoreSelected}
                            onRenameSelected={onRenameSelected}
                            onMoveSelected={onMoveSelected}
                        />
                    )}

                    <CreateFolderDialog
                        path={path}
                        open={createFolderDlgOpen}
                        onClose={onCreateFolderDlgClose}
                        onFolderCreated={() => {
                            onCreateFolderDlgClose();
                            refreshListing();
                        }}
                    />
                    <ConfirmationDialog
                        baseId={ids.DELETE_CONFIRM_DIALOG}
                        open={deleteConfirmOpen}
                        onClose={() => {
                            setDeleteConfirmOpen(false);
                        }}
                        title={t("Delete")}
                        contentText={t("deleteConfirmation")}
                        onConfirm={() => {
                            onDeleteSelected();
                            setDeleteConfirmOpen(false);
                        }}
                    />
                    <ConfirmationDialog
                        baseId={ids.EMPTY_TRASH_CONFIRM_DIALOG}
                        open={emptyTrashConfirmOpen}
                        onClose={() => {
                            setEmptyTrashConfirmOpen(false);
                        }}
                        title={t("emptyTrash")}
                        contentText={t("emptyTrashConfirmation")}
                        onConfirm={() => {
                            onEmptyTrashSelected();
                            setEmptyTrashConfirmOpen(false);
                        }}
                    />
                </>
            )}
        </Toolbar>
    );
}

export default DataToolbar;
