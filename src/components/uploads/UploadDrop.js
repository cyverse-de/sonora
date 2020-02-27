/**
 * @author johnworth
 *
 * Contains the logic for handling files dropped into the file listing.
 *
 * @module UploadDrop
 */

import UUID from "uuid/v4";

import { addAction } from "../../contexts/uploadTracking";

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
 * Adds an upload to the tracker.
 *
 * @param {File} uploadFile - The File object to be uploaded.
 * @param {string} destinationPath - The path to the directory the file should be uploaded to.
 * @returns null
 */

export const trackUpload = (uploadFile, destinationPath, dispatch) => {
    const newID = UUID();

    dispatch(
        addAction({
            id: newID,
            parentPath: destinationPath,
            filename: uploadFile.name,
            isUploading: false,
            hasUploaded: false,
            file: uploadFile,
        })
    );
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
    const allItems = convertDTIL(transferItemList);

    // Get all of the files split out into their own list.
    const fileItems = allItems
        .filter((i) => i.kind === "file")
        .map((i) => i.getAsFile())
        .filter((f) => f.size > 0) // filter out 0-byte files and directories.
        .map((i) => ({ kind: KindFile, value: i }));

    // Set the new value of uploadItems, which should trigger a re-render.
    return itemsFn(fileItems);
};

export default processDroppedFiles;
