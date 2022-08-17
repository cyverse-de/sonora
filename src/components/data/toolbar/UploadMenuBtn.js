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

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { Button, makeStyles, Menu } from "@material-ui/core";

import {
    Publish as UploadIcon,
    ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";

import BlockIcon from "@material-ui/icons/Block";

const useStyles = makeStyles(styles);

function UploadMenuBtn(props) {
    const {
        uploadMenuId,
        localUploadId,
        path,
        setUploadDialogOpen,
        setImportDialogOpen,
        uploadsEnabled,
    } = props;
    const { t } = useTranslation("data");
    const classes = useStyles();
    const uploadDispatch = useUploadTrackingDispatch();
    const [uploadAnchor, setUploadAnchor] = useState(null);

    const onUploadClose = () => {
        setUploadAnchor(null);
    };

    const onUploadMenuClick = (event) => {
        setUploadAnchor(event.currentTarget);
    };

    const trackAllUploads = (uploadFiles) => {
        uploadFiles.forEach((aFile) => {
            trackUpload(aFile.value, path, uploadDispatch);
        });
    };

    const handleUploadFiles = (files) => {
        processSelectedFiles(files, trackAllUploads);
    };

    const uploadButtonIcon = uploadsEnabled ? (
        <>
            <UploadIcon />
        </>
    ) : (
        <>
            <BlockIcon />
        </>
    );
    const uploadButtonColor = uploadsEnabled ? "primary" : "error";

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
                color={uploadButtonColor}
                className={classes.button}
                onClick={onUploadMenuClick}
                aria-haspopup={true}
                aria-controls={uploadMenuId}
                startIcon={uploadButtonIcon}
                endIcon={<ArrowDropDownIcon />}
            >
                {t("upload")}
            </Button>
            <Menu
                id={uploadMenuId}
                anchorEl={uploadAnchor}
                open={Boolean(uploadAnchor)}
                onClose={onUploadClose}
                getContentAnchorEl={null}
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

export default UploadMenuBtn;
