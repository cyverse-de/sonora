import UUID from "uuid/v4";
import { checkForError } from "../../common/callApi";

import {
    addAction,
    errorAction,
    updateStatusAction,
} from "../../contexts/uploadTracking";

/**
 * Starts a single upload.
 *
 * @param {File} uploadFile - The File object to be uploaded.
 * @param {string} destinationPath - The path to the directory the file should be uploaded to.
 * @return null
 */
export const startUpload = (
    uploadFile,
    destinationPath,
    dispatch,
    completedCB = () => {}
) => {
    const newID = UUID();

    const controller = new AbortController();
    const signal = controller.signal;

    const formData = new FormData();
    formData.append("file", uploadFile);

    const cancelFn = () => {
        controller.abort();
    };

    dispatch(
        addAction({
            id: newID,
            parentPath: destinationPath,
            filename: uploadFile.name,
            isUploading: true,
            hasUploaded: false,
            file: uploadFile,
            cancelFn,
        })
    );

    const endpoint = `/api/upload?dest=${destinationPath}`;
    const method = "POST";

    fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
        signal,
    })
        .then((resp) => checkForError(resp, { method, endpoint, headers: {} }))
        .then((resp) => {
            dispatch(
                updateStatusAction({
                    id: newID,
                    hasUploaded: true,
                    isUploading: false,
                })
            );

            completedCB(newID);
        })
        .catch((e) => {
            if (e.details) {
                console.error(
                    `${e.details.code} ${JSON.stringify(e.details.context)}`
                );
            } else {
                console.error(e.message);
            }

            dispatch(
                errorAction({
                    id: newID,
                    errorMessage: e.message,
                })
            );
        });
};
