/**
 * @author johnworth
 *
 * A table populated from tracked uploads. Used in the UploadQueue.
 *
 * @module UploadQueue
 */

import React from "react";

import {
    Avatar,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    useMediaQuery,
} from "@material-ui/core";

import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Error as ErrorIcon,
    Description as DescriptionIcon,
    Http as HttpIcon,
} from "@material-ui/icons";

import {
    KindFile,
    removeAction,
    useUploadTrackingState,
    useUploadTrackingDispatch,
} from "../../../contexts/uploadTracking";

import { useTheme } from "@material-ui/core/styles";

/**
 * Component for the upload status icon that chooses what to display based on the
 * state of the upload.
 *
 * @params {Object} props
 * @params {Object} props.upload - An upload from the upload tracker.
 * @returns {Object}
 */
const UploadStatus = ({ upload }) => {
    const theme = useTheme();

    let statusIcon = <div />;

    if (upload.isUploading) {
        statusIcon = <CircularProgress size={20} />;
    }

    if (upload.hasUploaded) {
        statusIcon = (
            <CheckCircleIcon style={{ color: theme.palette.success.main }} />
        );
    }

    if (upload.hasErrored) {
        statusIcon = <ErrorIcon color="error" />;
    }

    return statusIcon;
};

/**
 * Component for an item in the list of uploads.
 *
 * @params {Object} props
 * @params {Object} props.upload - An upload from the upload tracker.
 * @params {Object} props.handleCancel - A callback called when the cancel button is clicked.
 * @returns {Object}
 */
const UploadItem = ({ upload, handleCancel }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    {upload.kind === KindFile ? (
                        <DescriptionIcon />
                    ) : (
                        <HttpIcon />
                    )}
                </Avatar>
            </ListItemAvatar>

            {isSmall ? (
                <ListItemText primary={upload.filename} />
            ) : (
                <ListItemText
                    primary={upload.filename}
                    secondary={upload.parentPath}
                />
            )}

            <UploadStatus upload={upload} />

            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label="cancel-upload"
                    onClick={(e) => handleCancel(e, upload)}
                >
                    <CancelIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

/**
 * Default component that renders a list of uploads being tracked by the upload
 * tracker.
 *
 * @returns {Object}
 */
export default function UploadList() {
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();

    const handleCancel = (event, upload) => {
        event.stopPropagation();
        event.preventDefault();

        // Terminate the upload. For URL imports it will cancel the running job.
        upload.cancelFn();

        // Remove the upload from the tracker.
        dispatch(
            removeAction({
                id: upload.id,
            })
        );
    };

    return (
        <List dense={true}>
            {tracker.uploads.map((upload) => (
                <UploadItem
                    key={upload.id}
                    upload={upload}
                    handleCancel={handleCancel}
                />
            ))}
        </List>
    );
}
