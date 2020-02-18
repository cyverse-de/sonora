/**
 * Contains the logic for handling files dropped into the file listing.
 *
 * @module UploadDrop
 */

import UUID from "uuid/v4";

import {
    addAction,
    errorAction,
    updateStatusAction,
} from "../../../contexts/uploadTracking";

/**
 * Turns a DataTransferItemList into an actual array/list.
 * @param {DataTransferItemList} dtil - The DataTransferItemList to convert.
 * @returns {Array<object>}
 */
const convertDTIL = (dtil) => {
    let retval = [];

    for (var item of dtil) {
        retval = [...retval, item];
    }

    return retval;
};

const KindFile = "File";

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

    const formData = new FormData();
    formData.append("file", uploadFile);

    dispatch(
        addAction({
            id: newID,
            parentPath: destinationPath,
            filename: uploadFile.name,
            isUploading: true,
            hasUploaded: false,
        })
    );

    fetch(`/api/upload?dest=${destinationPath}`, {
        method: "POST",
        credentials: "include",
        body: formData,
    })
        .then(async (resp) => {
            if (resp.status < 200 || resp.status > 299) {
                // Hopefully temporary until we get a global error handler added.
                const {
                    error_code: errorCode,
                    ...errParams
                } = await resp.json();
                const errorMessage = `error code: ${errorCode},    error params: ${JSON.stringify(
                    errParams
                )}`;
                throw new Error(errorMessage);
            }

            // If we get here, the upload completed successfully.
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
            console.log(e.message);
            dispatch(
                errorAction({
                    id: newID,
                    errorMessage: e.message,
                })
            );
        });
};

/**
 * A normalized object representing something dropped into an element.
 *
 * @typedef DroppedItem
 * @property {string} kind - For now, will be set to 'File'.
 * @property {File} value - The File object.
 */

/**
 * The function that the list of dropped files is passed to for further processing.
 * You should define the return value.
 *
 * @callback itemsFn
 * @param {Array<DroppedItem>}
 * @returns null
 */

/**
 * A handler for processing files dropped into a window. See the usage in UploadCard.
 * Converts the items in the list into a cleaned up list of DroppedItems objects.
 *
 * @param {Array<Object>} transferItemList - The DataTransferItemList created by an onDrop event.
 * @param {itemsFn} itemsFn - The callback the list of dropped items are passed to.
 */
const processDroppedFiles = async (transferItemList, itemsFn) => {
    // TransferItemLists aren't actually arrays/lists in JS-land.
    let allItems = convertDTIL(transferItemList);

    // Get all of the files split out into their own list.
    let fileItems = allItems
        .filter((i) => i.kind === "file")
        .map((i) => i.getAsFile())
        .filter((f) => f.size > 0) // filter out 0-byte files and directories.
        .map((i) => ({ kind: KindFile, value: i }));

    // Clear out any nulls from the list.
    fileItems = fileItems.filter((i) => i !== null && i !== "undefined");

    // Set the new value of uploadItems, which should trigger a re-render.
    return itemsFn(fileItems);
};

export default processDroppedFiles;
