import callApi from "../common/callApi";

/**
 * Upload a file by URL
 * @param key - Query key for react-query
 * @param dest - The upload destination in the data store
 * @param address - The URL address for the upload
 * @returns {Promise<any>}
 */
export const uploadByUrl = ({ dest, address }) => {
    return callApi({
        endpoint: "/api/fileio/urlupload",
        method: "POST",
        body: { dest, address },
    });
};

/**
 * Upload text as file
 * @param dest - Destination of the file being uploaded
 * @param content - File content
 * @param newFile - true if this a new file.
 *
 * @returns {Promise<any>}
 */
export const uploadTextAsFile = ({ dest, content, newFile }) => {
    return callApi({
        endpoint: newFile ? "/api/fileio/saveas" : "/api/fileio/save",
        method: "POST",
        body: {
            dest,
            content,
        },
    });
};
