import React, { useState } from "react";
import {
    useUploadTrackingDispatch,
    useUploadTrackingState,
    addAction,
    errorAction,
    updateStatusAction,
} from "../../contexts/uploadTracking";
import { Typography } from "@material-ui/core";
import UUID from "uuid/v4";

const Uploadform = () => {
    const [destination, setDestination] = useState("");
    const [files, setFiles] = useState(null);
    const uploadDispatch = useUploadTrackingDispatch();
    const uploadState = useUploadTrackingState();
    const [trackedUploadID, setTrackedUploadID] = useState(null);

    const shouldDisplayUpload = trackedUploadID !== null;
    let displayInfo = "";
    if (shouldDisplayUpload) {
        const upload = uploadState.uploads.find(
            (i) => i.id === trackedUploadID
        );
        if (!upload.hasErrored) {
            displayInfo = `${upload.parentPath} ${upload.filename} Uploading: ${upload.isUploading} Has Uploaded: ${upload.hasUploaded}`;
        } else {
            displayInfo = `${upload.parentPath} ${upload.filename} Error: ${upload.errorMessage}`;
        }
    }

    const handleSubmit = (event) => {
        const formData = new FormData();
        formData.append("file", files[0]);

        const newID = UUID();
        setTrackedUploadID(newID);

        uploadDispatch(
            addAction({
                id: newID,
                parentPath: destination,
                filename: files[0].name,
                isUploading: true,
                hasUploaded: false,
            })
        );

        fetch(`/api/upload?dest=${destination}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then(async (resp) => {
                if (resp.status < 200 || resp.status > 299) {
                    const errorMessage = await resp.text();
                    throw new Error(errorMessage);
                }
                uploadDispatch(
                    updateStatusAction({
                        id: newID,
                        hasUploaded: true,
                        isUploading: false,
                    })
                );
            })
            .catch((e) => {
                uploadDispatch(
                    errorAction({
                        id: newID,
                        errorMessage: e.message,
                    })
                );
            });
    };

    return (
        <div>
            <br />

            <label>
                Destination: &nbsp;
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </label>

            <br />
            <br />

            <label>
                File: &nbsp;
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => setFiles(e.target.files)}
                />
            </label>

            <br />
            <br />

            <input type="submit" value="Upload File" onClick={handleSubmit} />

            {shouldDisplayUpload && <Typography>{displayInfo}</Typography>}
        </div>
    );
};

export default Uploadform;
