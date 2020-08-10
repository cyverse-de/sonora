import callApi from "../common/callApi";

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
export const dataSharing = ({ sharingReq: DataSharingBody }) => {
    return callApi({
        endpoint: "/api/share",
        method: "POST",
        body: DataSharingBody,
    });
};

export const dataUnsharing = ({ unsharingReq }) => {
    return callApi({
        endpoint: "/api/share",
        method: "POST",
        body: unsharingReq,
    });
};

export const shareApps = ({ appSharingRequest }) => {
    return callApi({
        endpoint: `/api/apps/sharing`,
        method: "POST",
        body: appSharingRequest,
    });
};

export const unshareApps = ({ appUnsharingRequest }) => {
    return callApi({
        endpoint: `/api/apps/unsharing`,
        method: "POST",
        body: appUnsharingRequest,
    });
};

export const shareAnalyses = ({ analysisSharingRequest }) => {
    return callApi({
        endpoint: `/api/analyses/sharing`,
        method: "POST",
        body: analysisSharingRequest,
    });
};

export const unshareAnalyses = ({ analysisUnsharingRequest }) => {
    return callApi({
        endpoint: `/api/analyses/unsharing`,
        method: "POST",
        body: analysisUnsharingRequest,
    });
};

export const shareTools = ({ toolSharingRequest }) => {
    return callApi({
        endpoint: `/api/tools/sharing`,
        method: "POST",
        body: toolSharingRequest,
    });
};

export const unshareTools = ({ toolUnsharingRequest }) => {
    return callApi({
        endpoint: `/api/tools/unsharing`,
        method: "POST",
        body: toolUnsharingRequest,
    });
};
