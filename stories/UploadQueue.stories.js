import React, { useState } from "react";
import UUID from "uuid/v4";

import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    useUploadTrackingState,
    showQueueAction,
    hideQueueAction,
    addAction,
} from "../src/contexts/uploadTracking";

import { Button } from "@material-ui/core";

import UploadQueue from "../src/components/uploads/queue";

export default {
    title: "Uploads/UploadQueue",
};

const TestDispatch = () => {
    const dispatch = useUploadTrackingDispatch();
    const state = useUploadTrackingState();

    const [hasRun, setHasRun] = useState(false);

    if (!hasRun) {
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

        dispatch(showQueueAction());

        setHasRun(true);
    }

    return (
        <>
            <Button
                onClick={() =>
                    state.showQueue
                        ? dispatch(hideQueueAction())
                        : dispatch(showQueueAction())
                }
            >
                {state.showQueue ? "Close" : "Open"}
            </Button>
        </>
    );
};

export const UploadQueueTest = () => {
    const testUploadFn = (file, dest, _dispatcher) =>
        console.log(`fake uploading ${file.name} to ${dest}`);

    return (
        <UploadTrackingProvider>
            <TestDispatch />

            <UploadQueue uploadFn={testUploadFn} />
        </UploadTrackingProvider>
    );
};
