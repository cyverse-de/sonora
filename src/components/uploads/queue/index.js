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
    // Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    // Table,
    // TableBody,
    // TableCell,
    // TableContainer,
    // TableHead,
    // TableRow,
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

// const useStyles = makeStyles((theme) => ({
//     table: {
//         // minWidth: 200,
//     },
//     inline: {
//         display: "inline",
//     },
// }));

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

const UploadItem = ({ upload, handleCancel }) => {
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

            <ListItemText
                primary={upload.filename}
                secondary={upload.parentPath}
            />

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

export default function UploadList() {
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();

    const handleCancel = (event, upload) => {
        event.stopPropagation();
        event.preventDefault();

        upload.cancelFn();

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
