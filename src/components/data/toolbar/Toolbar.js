/**
 * @author aramsey
 *
 * A component that acts as a header to the data listing view.
 * It contains the primary actions a user would want to accomplish with
 * data and also allows toggling the table or grid view.
 */

import React, { useCallback, useEffect, useState } from "react";

import DataDotMenu from "./DataDotMenu";
import UploadMenuBtn from "./UploadMenuBtn";
import Navigation from "./Navigation";

import ids from "../ids";
import messages from "../messages";
import styles from "../styles";
import CreateFolderDialog from "../CreateFolderDialog";
import { isWritable } from "../utils";

import UploadDialog from "../../uploads/dialog";
import DisplayTypeSelector from "../../utils/DisplayTypeSelector";

import { useUploadTrackingState } from "../../../contexts/uploadTracking";

import { injectIntl } from "react-intl";

import {
    announce,
    build,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    Button,
    Hidden,
    makeStyles,
    Toolbar,
    Typography,
    useTheme,
} from "@material-ui/core";

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
        intl,
    } = props;
    const theme = useTheme();
    const tracker = useUploadTrackingState();
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);
    const viewUploadQueue = useCallback(() => {
        return (
            <Button
                variant="outlined"
                onClick={() => setUploadDialogOpen(true)}
            >
                <Typography
                    variant="button"
                    style={{ color: theme.palette.primary.contrastText }}
                >
                    {formatMessage(intl, "uploadQueue")}
                </Typography>
            </Button>
        );
    }, [intl, theme.palette.primary.contrastText]);

    useEffect(() => {
        if (tracker.uploads.length > 0) {
            announce({
                text: formatMessage(intl, "filesQueuedForUploadMsg", {
                    total: tracker.uploads.length,
                }),
                CustomAction: viewUploadQueue,
            });
        }
    }, [tracker, intl, viewUploadQueue]);

    let toolbarId = build(baseId, ids.TOOLBAR);
    const uploadMenuId = build(toolbarId, ids.UPLOAD_MENU);
    const localUploadId = build(toolbarId, ids.UPLOAD_MI, ids.UPLOAD_INPUT);
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
                        <Hidden xsDown>{getMessage("details")}</Hidden>
                    </Button>
                )}
                {isWritable(permission) && (
                    <Button
                        id={build(toolbarId, ids.CREATE_BTN)}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={onCreateFolderClicked}
                        className={classes.button}
                        startIcon={<CreateNewFolder />}
                    >
                        <Hidden xsDown>{getMessage("folder")}</Hidden>
                    </Button>
                )}
                <UploadMenuBtn
                    uploadMenuId={uploadMenuId}
                    localUploadId={localUploadId}
                    path={path}
                    setUploadDialogOpen={setUploadDialogOpen}
                />
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
                getSelectedResources={getSelectedResources}
                selected={selected}
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
            <UploadDialog
                open={uploadDialogOpen}
                handleClose={() => setUploadDialogOpen(false)}
            />
        </Toolbar>
    );
}

export default withI18N(injectIntl(DataToolbar), messages);
