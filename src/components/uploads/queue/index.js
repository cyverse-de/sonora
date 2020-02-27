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

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

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

const UploadTableRow = ({ upload, handleCancel }) => {
    return (
        <TableRow key={upload.id}>
            <TableCell component="th" scope="row" align="center" padding="none">
                {upload.kind === KindFile ? <DescriptionIcon /> : <HttpIcon />}
            </TableCell>

            <TableCell component="th" scope="row" padding="none">
                {upload.filename}
            </TableCell>

            <TableCell component="th" scope="row" padding="none">
                {upload.parentPath}
            </TableCell>

            <TableCell component="th" scope="row" align="center" padding="none">
                <UploadStatus upload={upload} />
            </TableCell>

            <TableCell component="th" scope="row" align="center" padding="none">
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
            <Table stickyHeader className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" padding="none"></TableCell>
                        <TableCell padding="none">Name</TableCell>
                        <TableCell padding="none">Destination</TableCell>
                        <TableCell align="center" padding="none">
                            Status
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {tracker.uploads.map((upload) => (
                        <UploadTableRow
                            key={upload.id}
                            upload={upload}
                            handleCancel={handleCancel}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
