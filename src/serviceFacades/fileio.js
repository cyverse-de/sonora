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
