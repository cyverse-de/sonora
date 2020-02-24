/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadManager
 */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import UUID from "uuid/v4";
import { checkForError } from "../../common/callApi";

import {
    Drawer,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";

import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Error as ErrorIcon,
    Description as DescriptionIcon,
    Http as HttpIcon,
} from "@material-ui/icons";

import {
    addAction,
    errorAction,
    removeAction,
    updateStatusAction,
    useUploadTrackingDispatch,
    useUploadTrackingState,
    UploadTrackingProvider,
    KindFile,
} from "../../contexts/uploadTracking";

/**
 * Starts a single upload.
 *
 * @param {File} uploadFile - The File object to be uploaded.
 * @param {string} destinationPath - The path to the directory the file should be uploaded to.
 * @return null
 */
export const startUpload = (
    uploadFile,
    destinationPath,
    dispatch,
    completedCB = () => {}
) => {
    const newID = UUID();

    const controller = new AbortController();
    const signal = controller.signal;

    const formData = new FormData();
    formData.append("file", uploadFile);

    const cancelFn = () => {
        controller.abort();
    };

    dispatch(
        addAction({
            id: newID,
            parentPath: destinationPath,
            filename: uploadFile.name,
            isUploading: true,
            hasUploaded: false,
            file: uploadFile,
            cancelFn,
        })
    );

    const endpoint = `/api/upload?dest=${destinationPath}`;
    const method = "POST";

    fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
        signal,
    })
        .then((resp) => checkForError(resp, { method, endpoint, headers: {} }))
        .then((resp) => {
            dispatch(
                updateStatusAction({
                    id: newID,
                    hasUploaded: true,
                    isUploading: false,
                })
            );

            completedCB(newID);
        })
        .catch((e) => {
            if (e.details) {
                console.error(
                    `${e.details.code} ${JSON.stringify(e.details.context)}`
                );
            } else {
                console.error(e.message);
            }

            dispatch(
                errorAction({
                    id: newID,
                    errorMessage: e.message,
                })
            );
        });
};

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

const UploadStatus = ({ upload }) => {
    let statusIcon = <div />;

    if (upload.isUploading) {
        statusIcon = <CircularProgress size={20} />;
    }

    if (upload.hasUploaded) {
        statusIcon = <CheckCircleIcon />;
    }

    if (upload.hasErrored) {
        statusIcon = <ErrorIcon />;
    }

    return statusIcon;
};

export default function UploadQueue(props) {
    const classes = useStyles();

    const dispatch = useUploadTrackingDispatch();
    const tracker = useUploadTrackingState();

    const { open, onClose, uploadFn } = props;

    const running = tracker.uploads.filter(
        (upload) => upload.isUploading && !upload.hasUploaded
    );

    //const completed = tracker.uploads.filter((upload) => upload.hasUploaded);

    //const errored = tracker.uploads.filter((upload) => upload.hasErrored);

    const waiting = tracker.uploads.filter(
        (upload) =>
            !upload.hasErrored &&
            !upload.isUploading &&
            !UploadTrackingProvider.hasUploaded
    );

    // If there aren't three uploads running and there are uploads waiting, run them.
    if (
        tracker.uploads.length > 0 &&
        waiting.length > 0 &&
        running.length < 3
    ) {
        waiting.forEach((upload, idx) => {
            if (idx <= 2) {
                uploadFn(upload.file, upload.parentPath, dispatch);
            }
        });
    }

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
        <Drawer
            anchor="bottom"
            variant="persistent"
            open={open}
            onClose={onClose}
        >
            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Type</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tracker.uploads.map((upload) => (
                            <TableRow key={upload.id}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                >
                                    {upload.kind === KindFile ? (
                                        <DescriptionIcon />
                                    ) : (
                                        <HttpIcon />
                                    )}
                                </TableCell>

                                <TableCell component="th" scope="row">
                                    {upload.filename}
                                </TableCell>

                                <TableCell component="th" scope="row">
                                    {upload.parentPath}
                                </TableCell>

                                <TableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                >
                                    <UploadStatus upload={upload} />
                                </TableCell>

                                <TableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                >
                                    <IconButton
                                        onClick={(e) => handleCancel(e, upload)}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Drawer>
    );
}
