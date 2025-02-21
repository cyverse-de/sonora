import React, { useState } from "react";
import UploadDropTarget from "../src/components/uploads/UploadDropTarget";
import {
    UploadTrackingProvider,
    useUploadTrackingState,
} from "../src/contexts/uploadTracking";
import { DataTableViewTest } from "./data/TableView.stories";

export const UploadDropTargetTest = ({ uploadsEnabled }) => {
    return (
        <UploadTrackingProvider>
            <UnwrappedTest uploadsEnabled={uploadsEnabled} />
        </UploadTrackingProvider>
    );
};

const UnwrappedTest = ({ uploadsEnabled }) => {
    const [uploadsCompleted, setUploadsCompleted] = useState(0);
    const uploadState = useUploadTrackingState();

    const incrementCompleted = () => {
        setUploadsCompleted((uploadsCompleted) => uploadsCompleted + 1);
    };

    return (
        <>
            <UploadDropTarget
                path="/iplant/home/ipcdev/"
                uploadCompletedCB={incrementCompleted}
                uploadsEnabled={uploadsEnabled}
            >
                <DataTableViewTest />
            </UploadDropTarget>
            <br />
            UploadsCompleted: {uploadsCompleted}
            <br />
            UploadsTracked: {uploadState.uploads.length}
        </>
    );
};

UploadDropTargetTest.argTypes = {
    uploadsEnabled: {
        name: "Uploads Enabled",
        control: {
            type: "boolean",
        },
    },
};

UploadDropTargetTest.args = {
    uploadsEnabled: true,
};

export default {
    title: "Uploads",
};
