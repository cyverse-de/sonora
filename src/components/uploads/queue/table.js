/**
 * @author johnworth
 *
 * A table populated from tracked uploads. Used in the UploadQueue.
 *
 * @module UploadQueue
 */

import React from "react";

import {
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
    KindFile,
    removeAction,
    useUploadTrackingState,
    useUploadTrackingDispatch,
} from "../../../contexts/uploadTracking";

import useStyles from "./styles";

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

const UploadTableRow = ({ upload, handleCancel }) => {
    return (
        <TableRow key={upload.id}>
            <TableCell component="th" scope="row" align="center">
                {upload.kind === KindFile ? <DescriptionIcon /> : <HttpIcon />}
            </TableCell>

            <TableCell component="th" scope="row">
                {upload.filename}
            </TableCell>

            <TableCell component="th" scope="row">
                {upload.parentPath}
            </TableCell>

            <TableCell component="th" scope="row" align="center">
                <UploadStatus upload={upload} />
            </TableCell>

            <TableCell component="th" scope="row" align="center">
                <IconButton onClick={(e) => handleCancel(e, upload)}>
                    <CancelIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default function UploadsTable() {
    const classes = useStyles();
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
                        <UploadTableRow
                            upload={upload}
                            handleCancel={handleCancel}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
