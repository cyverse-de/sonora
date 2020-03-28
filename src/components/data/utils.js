/**
 * @author sriram
 *
 */
import constants from "../../constants";

/**
 * Encode given path
 *
 * @param {string} path - path selected by user
 * @returns {string} encoded path
 */
function getEncodedPath(path) {
    const encodedPath = path
        .split(constants.PATH_SEPARATOR)
        .map((item) => encodeURIComponent(item))
        .join(constants.PATH_SEPARATOR);
    return encodedPath;
}

/**
 *  Get storage id from router path
 *
 *  Sample path: /data/ds/iplant/home/ipcdev
 *
 * @param {string} pathname - path from the router
 * @returns {string|*} storage id
 */
function getStorageIdFromPath(pathname) {
    if (!pathname) {
        return "";
    }

    const paths = pathname.split(constants.PATH_SEPARATOR);
    if (paths.length > 2) {
        return paths[2];
    } else {
        // Default to data store.  Needed if user navigates to just /data.
        return "ds";
    }
}

export { getEncodedPath, getStorageIdFromPath };
