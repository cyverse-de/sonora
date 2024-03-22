/**
 * @author aramsey
 *
 * This is a simple button that shows the user their upload options
 * when clicked
 */

import React, { useState } from "react";

import UploadMenuItems from "./UploadMenuItems";
import FileBrowser from "./FileBrowser";

import ids from "../ids";
import styles from "../styles";

import { processSelectedFiles, trackUpload } from "../../uploads/UploadDrop";
import { useUploadTrackingDispatch } from "../../../contexts/uploadTracking";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { Button, Menu } from "@mui/material";

import { makeStyles } from "tss-react/mui";

import {
    Publish as UploadIcon,
    ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

import BlockIcon from "@mui/icons-material/Block";

const useStyles = makeStyles()(styles);

function UploadMenuBtn(props) {
    const {
        uploadMenuId,
        localUploadId,
        path,
        setUploadDialogOpen,
        setImportDialogOpen,
        uploadsEnabled,
        showErrorAnnouncer,
    } = props;
    const { t } = useTranslation("data");
    const { classes } = useStyles();
    const uploadDispatch = useUploadTrackingDispatch();
    const [uploadAnchor, setUploadAnchor] = useState(null);

    const onUploadClose = () => {
        setUploadAnchor(null);
    };

    const onUploadMenuClick = (event) => {
        if (uploadsEnabled) {
            setUploadAnchor(event.currentTarget);
        } else {
            showErrorAnnouncer(t("storageLimitExceeded"));
        }
    };

    const trackAllUploads = (uploadFiles) => {
        uploadFiles.forEach((aFile) => {
            trackUpload(aFile.value, path, uploadDispatch);
        });
    };

    const handleUploadFiles = (files) => {
        processSelectedFiles(files, trackAllUploads);
    };

    const UploadMenuButtonIcon = uploadsEnabled ? UploadIcon : BlockIcon;

    return (
        <>
            <FileBrowser
                id={localUploadId}
                handleUploadFiles={handleUploadFiles}
            />
            <Button
                id={buildID(uploadMenuId, ids.UPLOAD_BTN)}
                variant="outlined"
                size="small"
                disableElevation
                color="primary"
                className={classes.button}
                onClick={onUploadMenuClick}
                aria-haspopup={true}
                aria-controls={uploadMenuId}
                startIcon={<UploadMenuButtonIcon />}
                endIcon={<ArrowDropDownIcon />}
            >
                {t("upload")}
            </Button>
            <Menu
                id={uploadMenuId}
                anchorEl={uploadAnchor}
                open={Boolean(uploadAnchor)}
                onClose={onUploadClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <UploadMenuItems
                    localUploadId={localUploadId}
                    uploadMenuId={uploadMenuId}
                    onBrowseLocal={onUploadClose}
                    onImportFromURL={() => {
                        onUploadClose();
                        setImportDialogOpen(true);
                    }}
                    onUploadQueue={() => {
                        onUploadClose();
                        setUploadDialogOpen(true);
                    }}
                />
            </Menu>
        </>
    );
}

export default withErrorAnnouncer(UploadMenuBtn);
