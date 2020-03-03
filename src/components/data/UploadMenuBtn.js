/**
 * @author aramsey
 *
 * This is a simple button that shows the user their upload options
 * when clicked
 */

import React, { useState } from "react";

import { build, getMessage } from "@cyverse-de/ui-lib";
import { Button, Hidden, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { Publish as UploadIcon } from "@material-ui/icons";

import UploadDialog from "../uploads/dialog";

import ids from "./ids";
import styles from "./styles";

const useStyles = makeStyles(styles);

function UploadMenuBtn(props) {
    const { baseId } = props;
    const classes = useStyles();

    const [uploadAnchor, setUploadAnchor] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const onUploadClose = () => {
        setUploadAnchor(null);
    };

    const onUploadMenuClick = (event) => {
        setUploadAnchor(event.currentTarget);
    };

    const uploadMenuId = build(baseId, ids.UPLOAD_MENU);

    return (
        <>
            <Button
                id={build(baseId, ids.UPLOAD_BTN)}
                variant="contained"
                disableElevation
                color="primary"
                className={classes.button}
                onClick={onUploadMenuClick}
                aria-haspopup={true}
                aria-controls={uploadMenuId}
            >
                <UploadIcon className={classes.buttonIcon} />
                <Hidden xsDown>{getMessage("upload")}</Hidden>
            </Button>
            <Menu
                id={uploadMenuId}
                anchorEl={uploadAnchor}
                open={Boolean(uploadAnchor)}
                onClose={onUploadClose}
            >
                <MenuItem
                    id={build(uploadMenuId, ids.UPLOAD_MI)}
                    onClick={() => {
                        onUploadClose();
                        console.log("Browse Local");
                    }}
                >
                    {getMessage("browseLocal")}
                </MenuItem>
                <MenuItem
                    id={build(uploadMenuId, ids.IMPORT_MI)}
                    onClick={() => {
                        onUploadClose();
                        console.log("Import from URL");
                    }}
                >
                    {getMessage("importUrl")}
                </MenuItem>
                <MenuItem
                    id={build(uploadMenuId, ids.COGE_MI)}
                    onClick={() => {
                        onUploadClose();
                        console.log("Import from CoGe");
                    }}
                >
                    {getMessage("importCoge")}
                </MenuItem>
                <MenuItem
                    id={build(uploadMenuId, ids.MANUAL_UPLOAD_MI)}
                    onClick={() => {
                        onUploadClose();
                        console.log("Manual Upload");
                    }}
                >
                    {getMessage("manualUpload")}
                </MenuItem>
                <MenuItem
                    id={build(uploadMenuId, ids.UPLOAD_QUEUE_MI)}
                    onClick={() => {
                        onUploadClose();
                        setUploadDialogOpen(true);
                    }}
                >
                    {getMessage("uploadQueue")}
                </MenuItem>
            </Menu>

            <UploadDialog
                open={uploadDialogOpen}
                handleClose={() => setUploadDialogOpen(false)}
            />
        </>
    );
}

export default UploadMenuBtn;
