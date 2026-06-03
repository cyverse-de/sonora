/**
 * @author johnworth
 *
 * Contains API interactions concerning uploads.
 *
 * @module uploads/api
 */

import { IntercomEvents, trackIntercomEvent } from "common/intercom";
import {
    isMaintenanceResponse,
    triggerMaintenanceReload,
} from "common/maintenance";

import {
    errorAction,
    setCancelFnAction,
    updateStatusAction,
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

    const endpoint = `/api/upload?dest=${encodeURIComponent(destinationPath)}`;
    const method = "POST";

    fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
        signal,
    })
        .then((resp) => {
            // Mirror the axios interceptor: a maintenance-mode 503 forces a hard
            // reload so the browser lands on the gateway's maintenance page. Check
            // the header before parsing so a non-JSON maintenance body can't throw
            // first, then re-check once the body is available.
            if (
                isMaintenanceResponse({
                    status: resp.status,
                    headers: resp.headers,
                })
            ) {
                triggerMaintenanceReload();
                return new Promise(() => {});
            }
            // resp.json() contains the response body, but returns another promise
            return resp.json().then((data) => {
                if (isMaintenanceResponse({ status: resp.status, data })) {
                    triggerMaintenanceReload();
                    return new Promise(() => {});
                }
                return {
                    ok: resp.ok,
                    status: resp.status,
                    data,
                };
            });
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
            let errorMessage = JSON.stringify(e);
            if (e.data) {
                const { error_code, ...rest } = e.data;
                errorMessage = `${error_code} ${JSON.stringify(rest)}`;
            }
            console.error(errorMessage);

            dispatch(
                errorAction({
                    id: upload.id,
                    errorMessage: e?.data || errorMessage,
                })
            );
        });
};
