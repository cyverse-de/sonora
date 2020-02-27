/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadQueue
 */
import React, { useEffect } from "react";

import {
    useUploadTrackingState,
    useUploadTrackingDispatch,
} from "../../../contexts/uploadTracking";

import { startUpload } from "../api";

/**
 * Returns true if the upload passed in is waiting to be uploaded.
 *
 * @params {Object} upload - An upload from the tracker.
 * @returns {boolean}
 */
const uploadIsWaiting = (upload) =>
    !upload.hasUploaded && !upload.hasErrored && !upload.isUploading;

/**
 * Returns true if the upload passed in is currently running.
 *
 * @params {Object} upload -An upload from the tracker.
 * @returns {boolean}
 */
const uploadIsRunning = (upload) =>
    upload.isUploading && !upload.hasUploaded && !upload.hasErrored;

// adapted from https://codereview.stackexchange.com/a/162879

/**
 * Partitions the list of uploads into a trio of lists, one for uploads
 * that are waiting to run, one for uploads that are currently running,
 * and one for uploads that are in other states (probably errored).
 *
 * @params {Array<Object>} uploads - An array of uploads from the tracker.
 * @returns {Array<Array<Object>>}
 */
const partitionUploads = (uploads) => {
    const [waiting, running, other] = [0, 1, 2];

    const uploadIndex = (upload) => {
        if (uploadIsWaiting(upload)) return waiting;
        if (uploadIsRunning(upload)) return running;
        return other;
    };

    return uploads.reduce(
        (acc, upload) => {
            switch (uploadIndex(upload)) {
                case waiting:
                    acc[waiting].push(upload);
                    break;
                case running:
                    acc[running].push(upload);
                    break;
                default:
                    acc[other].push(upload);
            }

            return acc;
        },
        [[], [], []]
    );
};

/**
 * A component that is responsible for triggering the actual uploads of items
 * in the tracker. Doesn't render anything, purely exists to trigger uploads.
 *
 * @returns {Object}
 */
export default function UploadManager() {
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();

    const [waiting, running] = partitionUploads(tracker.uploads);

    // Controls starting the uploads.
    useEffect(() => {
        // Browser can technically do more than 3 uploads at once now, but
        // we're limiting it here to prevent hammering our API too much.
        if (
            tracker.uploads.length > 0 &&
            waiting.length > 0 &&
            running.length < 3
        ) {
            waiting.forEach((upload, idx) => {
                if (idx <= 2) {
                    startUpload(upload.file, upload.parentPath, dispatch);
                }
            });
        }
    }, [tracker, waiting, running, dispatch]);

    return <div id="upload-manager" />;
}
