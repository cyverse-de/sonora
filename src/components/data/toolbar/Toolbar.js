/**
 * @author aramsey
 *
 * A component that acts as a header to the data listing view.
 * It contains the primary actions a user would want to accomplish with
 * data and also allows toggling the table or grid view.
 */

import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import DataDotMenu from "./DataDotMenu";
import UploadMenuBtn from "./UploadMenuBtn";
import Navigation from "./Navigation";

import ids from "../ids";
import styles from "../styles";
import CreateFolderDialog from "../CreateFolderDialog";
import { isWritable } from "../utils";

import DisplayTypeSelector from "../../utils/DisplayTypeSelector";

import { build } from "@cyverse-de/ui-lib";

import { Button, Hidden, makeStyles, Toolbar } from "@material-ui/core";

import { CreateNewFolder, Info } from "@material-ui/icons";

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
        isGridView,
        toggleDisplay,
        onDeleteSelected,
        detailsEnabled,
        onDetailsSelected,
        handlePathChange,
        handleDataNavError,
        setImportDialogOpen,
        setUploadDialogOpen,
        localUploadId,
        uploadMenuId,
        onCreateHTFileSelected,
        onCreateMultiInputFileSelected,
    } = props;

    const { t } = useTranslation("data");
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);

    let toolbarId = build(baseId, ids.TOOLBAR);
    return (
        <Toolbar variant="dense">
            <DisplayTypeSelector
                baseId={toolbarId}
                toggleDisplay={toggleDisplay}
                isGridView={isGridView}
            />
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
            </Hidden>
            <DataDotMenu
                baseId={toolbarId}
                path={path}
                onDeleteSelected={onDeleteSelected}
                onCreateFolderSelected={onCreateFolderClicked}
                onDetailsSelected={onDetailsSelected}
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
                onCreateMultiInputFileSelected={onCreateMultiInputFileSelected}
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
        </Toolbar>
    );
}

export default DataToolbar;
