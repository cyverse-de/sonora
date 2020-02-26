/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadQueue
 */
import React, { useState, useEffect } from "react";

import { Drawer } from "@material-ui/core";

import {
    useUploadTrackingState,
    useUploadTrackingDispatch,
    hideQueueAction,
    showQueueAction,
} from "../../../contexts/uploadTracking";

import { startUpload } from "../api";

import UploadsToolbar from "./toolbar";
import UploadsTable from "./table";
import useStyles from "./styles";

const Closable = ({ open, onClose, children }) => {
    const [hasOpened, setHasOpened] = useState(false);

    if (!open) {
        if (hasOpened) {
            onClose();
            setHasOpened(false);
        }

        return null;
    }

    if (!hasOpened) {
        setHasOpened(true);
    }
    return <div>{children}</div>;
};

const uploadIsWaiting = (upload) =>
    !upload.hasUploaded && !upload.hasErrored && !upload.isUploading;

const uploadIsRunning = (upload) =>
    upload.isUploading && !upload.hasUploaded && !upload.hasErrored;

// adapted from https://codereview.stackexchange.com/a/162879
const partitionUploads = (uploads) => {
    const [waiting, running, other] = [0, 1, 2];

    const uploadIndex = (upload) => {
        if (uploadIsWaiting(upload)) return waiting;
        if (uploadIsRunning(upload)) return running;
        return other;
    };

    return uploads.reduce(
        (acc, upload) => {
            switch (uploadIndex(upload)) {
                case waiting:
                    acc[waiting].push(upload);
                    break;
                case running:
                    acc[running].push(upload);
                    break;
                default:
                    acc[other].push(upload);
            }

            return acc;
        },
        [[], [], []]
    );
};

export default function UploadQueue(props) {
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();
    const classes = useStyles();

    const [isMaximized, setIsMaximized] = useState(true);
    const [wasClosed, setWasClosed] = useState(false);

    const { uploadFn = startUpload, shouldProcessUploads = true } = props;

    const [waiting, running] = partitionUploads(tracker.uploads);

    // Controls starting the uploads.
    useEffect(() => {
        // Making the upload triggers conditional makes the stories/tests a bit
        // easier to write.
        if (shouldProcessUploads) {
            // Browser can technically do more than 3 uploads at once now, but
            // we're limiting it here to prevent hammering our API too much.
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
        }
    }, [
        tracker.uploads,
        waiting,
        running,
        shouldProcessUploads,
        dispatch,
        uploadFn,
    ]);

    // Controls whether to pop open the upload queue or not.
    useEffect(() => {
        if (!wasClosed) {
            // If the queue was not actively closed and there are new uploads
            // started, open the queue.
            if (running.length > 0) {
                dispatch(showQueueAction());
            }
        } else {
            // If the queue was closed but the number of running and waiting
            // uploads is now zero, reset the wasClosed state to false so the
            // queue will open again if new uploads are added.
            if (running.length === 0 && waiting.length === 0) {
                setWasClosed(false);
            }
        }
    }, [wasClosed, running, waiting, dispatch]);

    const handleClose = () => {
        dispatch(hideQueueAction());
        setWasClosed(true);
    };

    return (
        <Closable
            open={tracker.showQueue}
            onClose={handleClose}
            className={classes.closable}
        >
            <Drawer
                anchor="bottom"
                variant="persistent"
                open={true}
                classes={{
                    paper: isMaximized ? classes.drawerMax : classes.drawerMin,
                }}
            >
                <UploadsToolbar
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    onClose={handleClose}
                />

                <UploadsTable />
            </Drawer>
        </Closable>
    );
}
