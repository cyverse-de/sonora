/**
 * @author aramsey
 *
 * This is a simple button that shows the user their upload options
 * when clicked
 */

import React, { useEffect, useState, useCallback } from "react";

import {
    build,
    getMessage,
    formatMessage,
    announce,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Publish as UploadIcon } from "@material-ui/icons";

import UploadDialog from "../uploads/dialog";

import ids from "./ids";
import styles from "./styles";
import { useUploadTrackingState } from "../../contexts/uploadTracking";
import { injectIntl } from "react-intl";
import intlData from "./messages";

const useStyles = makeStyles(styles);

function UploadMenuBtn(props) {
    const { baseId, intl } = props;
    const theme = useTheme();
    const classes = useStyles();
    const tracker = useUploadTrackingState();

    const [uploadAnchor, setUploadAnchor] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
                text: `${tracker.uploads.length} ${formatMessage(
                    intl,
                    "filesQueuedForUploadMsg"
                )}`,
                customAction: viewUploadQueue,
            });
        }
    }, [tracker, intl, viewUploadQueue]);

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

export default withI18N(injectIntl(UploadMenuBtn), intlData);
