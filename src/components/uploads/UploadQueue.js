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
    //Divider,
    Drawer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    //Typography,
} from "@material-ui/core";

import {
    addAction,
    errorAction,
    //removeAction,
    updateStatusAction,
    useUploadTrackingDispatch,
    useUploadTrackingState,
    UploadTrackingProvider,
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

    const formData = new FormData();
    formData.append("file", uploadFile);

    dispatch(
        addAction({
            id: newID,
            parentPath: destinationPath,
            filename: uploadFile.name,
            isUploading: true,
            hasUploaded: false,
        })
    );

    const endpoint = `/api/upload?dest=${destinationPath}`;
    const method = "POST";

    fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
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

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function UploadQueue(props) {
    const classes = useStyles();

    const dispatch = useUploadTrackingDispatch();
    const tracker = useUploadTrackingState();

    const { open, onClose } = props;

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
                startUpload(upload.file, upload.parentPath, dispatch);
            }
        });
    }

    // Remove completed uploads from the tracker.
    // completed.forEach((upload) => {
    //     dispatch(
    //         removeAction({
    //             id: upload.id,
    //         })
    //     );
    // });

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
                            <TableCell>Name</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tracker.uploads.map((upload) => (
                            <TableRow key={upload.id}>
                                <TableCell component="th" scope="row">
                                    {upload.filename}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {upload.parentPath}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {upload.isUploading}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Drawer>
    );
}
