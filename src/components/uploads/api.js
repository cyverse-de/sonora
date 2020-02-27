/**
 * @author johnworth
 *
 * Contains API interactions concerning uploads.
 *
 * @module uploads/api
 */

import { checkForError } from "../../common/callApi";

import {
    errorAction,
    updateStatusAction,
    setCancelFnAction,
} from "../../contexts/uploadTracking";

/**
 * Starts a single upload.
 *
 * @param {Object} upload - An upload from the tracker.
 * @param {string} destinationPath - The path to the directory the file should be uploaded to.
 * @return null
 */
export const startUpload = (
    upload,
    destinationPath,
    dispatch,
    completedCB = () => {}
) => {
    const uploadFile = upload.file;
    const controller = new AbortController();
    const signal = controller.signal;

    const formData = new FormData();
    formData.append("file", uploadFile);

    const cancelFn = () => {
        controller.abort();
    };

    dispatch(
        setCancelFnAction({
            id: upload.id,
            cancelFn: cancelFn,
        })
    );

    dispatch(
        updateStatusAction({
            id: upload.id,
            isUploading: true,
            hasUploaded: false,
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
                    id: upload.id,
                    hasUploaded: true,
                    isUploading: false,
                })
            );

            completedCB(upload.id);
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
                    id: upload.id,
                    errorMessage: e.message,
                })
            );
        });
};
