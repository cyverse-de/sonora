import React, { useState } from "react";
import UUID from "uuid/v4";

import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    addAction,
} from "../src/contexts/uploadTracking";

import { Button } from "@material-ui/core";

import UploadQueue from "../src/components/uploads/UploadQueue";

export default {
    title: "Uploads/UploadQueue",
};

const TestDispatch = () => {
    const dispatch = useUploadTrackingDispatch();
    const [hasRun, setHasRun] = useState(false);

    if (hasRun) {
        return <></>;
    }

    dispatch(
        addAction({
            id: UUID(),
            parentPath: "/iplant/home/ipcdev/test-0",
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

    if (!hasRun) {
        setHasRun(true);
    }

    return <></>;
};

export const UploadQueueTest = () => {
    const testUploadFn = (file, dest, _dispatcher) =>
        console.log(`fake uploading ${file.name} to ${dest}`);

    const [open, setOpen] = useState(true);
    return (
        <div>
            <Button onClick={() => setOpen(!open)}>
                {open ? "Close" : "Open"}
            </Button>
            <UploadTrackingProvider>
                <TestDispatch />
                <UploadQueue
                    open={open}
                    uploadFn={testUploadFn}
                    onClose={() => setOpen(false)}
                />
            </UploadTrackingProvider>
        </div>
    );
};
