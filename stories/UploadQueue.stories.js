import React from "react";
import UUID from "uuid/v4";

import {
    UploadTrackingProvider,
    useUploadTrackingDispatch,
    addAction,
} from "../src/contexts/uploadTracking";

import UploadQueue from "../src/components/uploads/UploadQueue";

export default {
    title: "Uploads/UploadQueue",
};

export const UploadQueueTest = () => {
    const TestDispatch = () => {
        const dispatch = useUploadTrackingDispatch();
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
        return <></>;
    };

    const testUploadFn = (file, dest, _dispatcher) =>
        console.log(`fake uploading ${file.name} to ${dest}`);
    return (
        <UploadTrackingProvider>
            <TestDispatch />
            <UploadQueue open={true} uploadFn={testUploadFn} />
        </UploadTrackingProvider>
    );
};
