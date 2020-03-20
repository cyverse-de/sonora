import callApi from "../../common/callApi";

/**
 * @typedef DataSharingPath
 * @property {string} path - A string representing a path
 * @property {Permission} permission - See models/Permissions
 */

/**
 * @typedef DataSharing
 * @property {string} user - The user ID
 * @property {Array.<DataSharingPath>} paths - An array of DataSharingPath
 */

/**
 * @typedef DataSharingBody
 * @property {Array.<DataSharing>} sharing - An array of DataSharing
 */

/**
 * Update with whom a data resource is shared
 * @param DataSharingBody A DataSharing object
 * @returns {Promise<any>}
 */
export const updateSharing = (DataSharingBody) => {
    return callApi({
        endpoint: "/api/share",
        method: "POST",
        body: DataSharingBody,
    });
};
