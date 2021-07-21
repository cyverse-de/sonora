/**
 * @author johnworth
 *
 * Contains API interactions concerning uploads.
 *
 * @module uploads/api
 */

import { IntercomEvents, trackIntercomEvent } from "common/intercom";

import { errorAction, setCancelFnAction, updateStatusAction } from "../../contexts/uploadTracking";

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
        .then((resp) => {
            // resp.json() contains the response body, but returns another promise
            return resp.json().then((data) => ({
                ok: resp.ok,
                status: resp.status,
                data,
            }));
        })
        .then((resp) => {
            if (!resp.ok) {
                throw resp;
            } else {
                return resp;
            }
        })
        .then((resp) => {
            dispatch(
                updateStatusAction({
                    id: upload.id,
                    hasUploaded: true,
                    isUploading: false,
                })
            );
            trackIntercomEvent(IntercomEvents.FILE_UPLOADED, {
                destinationPath,
                filename: uploadFile?.name,
            });
            completedCB(upload.id);
        })
        .catch((e) => {
            let errorMessage = e;
            if (e.data) {
                const { error_code, ...rest } = e.data;
                errorMessage = `${error_code} ${JSON.stringify(rest)}`;
            }
            console.error(errorMessage);

            dispatch(
                errorAction({
                    id: upload.id,
                    errorMessage: errorMessage,
                })
            );
        });
};
