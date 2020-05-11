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
import intlData from "../messages";

import { processSelectedFiles, trackUpload } from "../../uploads/UploadDrop";
import { useUploadTrackingDispatch } from "../../../contexts/uploadTracking";

import { injectIntl } from "react-intl";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { Button, makeStyles, Menu } from "@material-ui/core";

import {
    Publish as UploadIcon,
    ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

function UploadMenuBtn(props) {
    const { uploadMenuId, localUploadId, path, setUploadDialogOpen } = props;
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

    return (
        <>
            <FileBrowser
                id={localUploadId}
                handleUploadFiles={handleUploadFiles}
            />
            <Button
                id={build(uploadMenuId, ids.UPLOAD_BTN)}
                variant="outlined"
                disableElevation
                color="primary"
                className={classes.button}
                onClick={onUploadMenuClick}
                aria-haspopup={true}
                aria-controls={uploadMenuId}
                startIcon={<UploadIcon />}
                endIcon={<ArrowDropDownIcon />}
            >
                {getMessage("upload")}
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
                        console.log("Import from URL");
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

export default withI18N(injectIntl(UploadMenuBtn), intlData);
