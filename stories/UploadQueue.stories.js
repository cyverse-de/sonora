import React, { useState } from "react";
import UUID from "uuid/v4";

import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    addAction,
} from "../src/contexts/uploadTracking";

import { Button } from "@mui/material";

import UploadDialog from "../src/components/uploads/dialog";

export default {
    title: "Uploads Queue",
};

const TestDispatch = () => {
    const dispatch = useUploadTrackingDispatch();

    const [hasRun, setHasRun] = useState(false);

    if (!hasRun) {
        dispatch(
            addAction({
                id: UUID(),
                parentPath:
                    "/iplant/home/ipcdev/test-0/foo/bar/baz/blippy/this/should/be/really/long",
                filename: "fake-upload-0",
                isUploading: true,
                hasUploaded: false,
                file: {
                    name: "fake-upload-0",
                },
            })
        );

        dispatch(
            addAction({
                id: UUID(),
                parentPath: "/iplant/home/ipcdev/test-1",
                filename: "fake-upload-1",
                isUploading: false,
                hasUploaded: true,
                file: {
                    name: "fake-upload-1",
                },
            })
        );

        dispatch(
            addAction({
                id: UUID(),
                parentPath: "/iplant/home/ipcdev/test-2",
                filename: "fake-upload-2",
                isUploading: false,
                hasUploaded: false,
                hasErrored: true,
                errorMessage: "test error message",
                file: {
                    name: "fake-upload-2",
                },
            })
        );

        dispatch(
            addAction({
                id: UUID(),
                parentPath: "/iplant/home/ipcdev/test-3",
                filename: "fake-upload-3",
                isUploading: false,
                hasUploaded: false,
                file: {
                    name: "fake-upload-3",
                },
            })
        );

        setHasRun(true);
    }

    return <></>;
};

export const UploadQueueTest = () => {
    const [open, setOpen] = useState(true);
    const handleClose = () => setOpen(!open);

    return (
        <UploadTrackingProvider>
            <Button onClick={() => setOpen(true)}>Open</Button>

            <TestDispatch />

            <UploadDialog open={open} handleClose={handleClose} />
        </UploadTrackingProvider>
    );
};
