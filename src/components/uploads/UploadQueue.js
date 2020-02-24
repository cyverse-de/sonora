/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadManager
 */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

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
    Toolbar,
    Typography,
} from "@material-ui/core";

import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Error as ErrorIcon,
    Description as DescriptionIcon,
    Http as HttpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";

import {
    removeAction,
    useUploadTrackingDispatch,
    useUploadTrackingState,
    UploadTrackingProvider,
    KindFile,
} from "../../contexts/uploadTracking";

const drawerMinHeight = 45;

const useStyles = makeStyles((theme) => ({
    drawerMax: {
        height: "50%",
    },
    drawerMin: {
        height: drawerMinHeight,
    },
    table: {
        minWidth: 650,
    },
    toolBar: {
        backgroundColor: theme.palette.primary.main,
        minHeight: drawerMinHeight,
    },
    toolBarRoot: {
        flexGrow: 1,
    },
    uploadTypography: {
        color: theme.palette.primary.contrastText,
        flexGrow: 1,
    },
    toolBarAction: {
        color: theme.palette.primary.contrastText,
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
    const [isMaximized, setIsMaximized] = useState(open);

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
        <>
            <Drawer
                anchor="bottom"
                variant="persistent"
                open={open}
                onClose={onClose}
                classes={{
                    paper: isMaximized ? classes.drawerMax : classes.drawerMin,
                }}
            >
                <div className={classes.toolBarRoot}>
                    <Toolbar
                        variant="dense"
                        color="primary"
                        className={classes.toolBar}
                    >
                        <Typography
                            variant="h6"
                            className={classes.uploadTypography}
                        >
                            Uploads
                        </Typography>

                        <IconButton
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? (
                                <KeyboardArrowDownIcon
                                    className={classes.toolBarAction}
                                />
                            ) : (
                                <KeyboardArrowUpIcon
                                    className={classes.toolBarAction}
                                />
                            )}
                        </IconButton>

                        <IconButton
                            onClick={() => {
                                setIsMaximized(false);
                                onClose();
                            }}
                        >
                            <CancelIcon className={classes.toolBarAction} />
                        </IconButton>
                    </Toolbar>
                </div>

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
                                            onClick={(e) =>
                                                handleCancel(e, upload)
                                            }
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
        </>
    );
}
