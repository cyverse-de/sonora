/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadQueue
 */
import React, { useState } from "react";

import { Drawer } from "@material-ui/core";

import {
    useUploadTrackingState,
    useUploadTrackingDispatch,
    hideQueueAction,
} from "../../../contexts/uploadTracking";

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

export default function UploadQueue(props) {
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();

    const classes = useStyles();
    const { uploadFn, shouldProcessUploads = true } = props;
    const [isMaximized, setIsMaximized] = useState(true);

    if (shouldProcessUploads) {
        const waiting = tracker.uploads.filter(
            (upload) =>
                !upload.hasUploaded && !upload.hasErrored && !upload.isUploading
        );

        const running = tracker.uploads.filter(
            (upload) =>
                upload.isUploading && !upload.hasUploaded && !upload.hasErrored
        );

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

    const handleClose = () => {
        dispatch(hideQueueAction());
    };

    return (
        <>
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
                        paper: isMaximized
                            ? classes.drawerMax
                            : classes.drawerMin,
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
        </>
    );
}
