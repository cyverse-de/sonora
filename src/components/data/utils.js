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
 * @param {string} pathname - path from the router
 * @returns {string|*} storage id
 */
function getStorageIdFromPath(pathname) {
    if (!pathname) {
        return "";
    }
    return pathname.split(constants.PATH_SEPARATOR)[2];
}

export { getEncodedPath, getStorageIdFromPath };
