import React, { useState } from "react";
import UploadDropTarget from "../src/components/uploads/UploadDropTarget";
import {
    UploadTrackingProvider,
    useUploadTrackingState,
} from "../src/contexts/uploadTracking";
import { DataTableViewTest } from "./data/TableView.stories";
import fetchMock from "fetch-mock";

fetchMock.restore().post(/\/api\/upload\/?\??.*/, {
    file: {
        infoType: "",
        path: "/iplant/home/ipcdev/lein-plugins.txt",
        "share-count": 0,
        "date-created": 1580918919000,
        md5: "1deaf230acfa890bb0dabab537aff216",
        permission: "own",
        "date-modified": 1580918919000,
        type: "file",
        "file-size": 285,
        label: "lein-plugins.txt",
        id: "c5f7e42a-4831-11ea-a8b1-fa163e806578",
        "content-type": "text/plain",
    },
});

export const UploadDropTargetTest = ({ children }) => {
    return (
        <UploadTrackingProvider>
            <UnwrappedTest />
        </UploadTrackingProvider>
    );
};

const UnwrappedTest = () => {
    const [uploadsCompleted, setUploadsCompleted] = useState(0);
    const uploadState = useUploadTrackingState();

    const incrementCompleted = () => {
        setUploadsCompleted((uploadsCompleted) => uploadsCompleted + 1);
    };

    fetchMock.restore().post(/\/api\/upload\/?\??.*/, {
        file: {
            infoType: "",
            path: "/iplant/home/ipcdev/lein-plugins.txt",
            "share-count": 0,
            "date-created": 1580918919000,
            md5: "1deaf230acfa890bb0dabab537aff216",
            permission: "own",
            "date-modified": 1580918919000,
            type: "file",
            "file-size": 285,
            label: "lein-plugins.txt",
            id: "c5f7e42a-4831-11ea-a8b1-fa163e806578",
            "content-type": "text/plain",
        },
    });

    return (
        <>
            <UploadDropTarget
                path="/iplant/home/ipcdev/"
                uploadCompletedCB={incrementCompleted}
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

export default {
    title: "Uploads",
};
