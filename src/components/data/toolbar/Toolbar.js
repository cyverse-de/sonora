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

import ids from "../ids";
import styles from "../styles";
import CreateFolderDialog from "../CreateFolderDialog";
import { isOwner, isWritable } from "../utils";
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
} from "@material-ui/icons";

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
        onCreateHTFileSelected,
        onCreateMultiInputFileSelected,
        setSharingDlgOpen,
        onMetadataSelected,
        onPublicLinksSelected,
    } = props;

    const { t } = useTranslation("data");
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);
    const selectedResources = getSelectedResources();
    const canShare = isOwner(selectedResources);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const hasDotMenu =
        (isSmall && selectedResources && selectedResources.length > 0) ||
        isWritable(permission);

    let toolbarId = build(baseId, ids.TOOLBAR);
    return (
        <Toolbar variant="dense">
            <Navigation
                path={path}
                handleDataNavError={handleDataNavError}
                handlePathChange={handlePathChange}
                baseId={toolbarId}
            />
            <div className={classes.divider} />
            <Hidden smDown>
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
                {isWritable(permission) && (
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
                {selected && selected.length > 0 && (
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
                {canShare && (
                    <SharingButton
                        size="small"
                        baseId={toolbarId}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                )}
            </Hidden>

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
                    onCreateHTFileSelected={onCreateHTFileSelected}
                    onCreateMultiInputFileSelected={
                        onCreateMultiInputFileSelected
                    }
                    canShare={canShare}
                    setSharingDlgOpen={setSharingDlgOpen}
                    isSmall={isSmall}
                    onMetadataSelected={onMetadataSelected}
                    onPublicLinksSelected={onPublicLinksSelected}
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
        </Toolbar>
    );
}

export default DataToolbar;
