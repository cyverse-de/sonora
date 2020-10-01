import callApi from "../common/callApi";

import Permissions from "../components/models/Permissions";

import { getResourcePermissions, RESOURCE_PERMISSIONS_KEY } from "./filesystem";
import { getAppPermissions } from "./apps";
import { getAnalysisPermissions } from "./analyses";
import { getToolPermissions } from "./tools";

export const GET_PERMISSIONS_QUERY_KEY = "fetchSharingPermissions";

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

export const searchSubjects = ({ searchTerm }) => {
    return callApi({
        endpoint: `/api/subjects`,
        params: { search: searchTerm.trim() },
    });
};

export const doSharingUpdates = ({ sharing, unsharing }) => {
    const { data, apps, analyses, tools } = sharing;
    const {
        data: dataUnshare,
        apps: appsUnshare,
        analyses: analysesUnshare,
        tools: toolsUnshare,
    } = unsharing;
    let promises = [];
    if (data && data.length > 0) {
        promises.push(dataSharing({ sharingReq: { sharing: data } }));
    }
    if (dataUnshare && dataUnshare.length > 0) {
        promises.push(
            dataUnsharing({ unsharingReq: { unsharing: dataUnshare } })
        );
    }
    if (apps && apps.length > 0) {
        promises.push(shareApps({ appSharingRequest: { sharing: apps } }));
    }
    if (appsUnshare && appsUnshare.length > 0) {
        promises.push(
            unshareApps({ appUnsharingRequest: { unsharing: appsUnshare } })
        );
    }
    if (analyses && analyses.length > 0) {
        promises.push(
            shareAnalyses({ analysisSharingRequest: { sharing: analyses } })
        );
    }
    if (analysesUnshare && analysesUnshare.length > 0) {
        promises.push(
            unshareAnalyses({
                analysisUnsharingRequest: { unsharing: analysesUnshare },
            })
        );
    }
    if (tools && tools.length > 0) {
        promises.push(shareTools({ toolSharingRequest: { sharing: tools } }));
    }
    if (toolsUnshare && toolsUnshare.length > 0) {
        promises.push(
            unshareTools({ toolUnsharingRequest: { unsharing: toolsUnshare } })
        );
    }

    return Promise.all(promises);
};

const getPaths = ({ paths }) => {
    return paths ? paths.map((resource) => resource.path) : null;
};

const getAppIds = ({ apps }) => {
    return apps
        ? apps.map((resource) => {
              return {
                  app_id: resource.id,
                  system_id: resource.system_id,
              };
          })
        : null;
};

const getAnalysisIds = ({ analyses }) => {
    return analyses ? analyses.map((resource) => resource.id) : null;
};

const getToolIds = ({ tools }) => {
    return tools ? tools.map((resource) => resource.id) : null;
};

export const getPermissions = (key, { resources }) => {
    const paths = getPaths(resources);
    const apps = getAppIds(resources);
    const analyses = getAnalysisIds(resources);
    const tools = getToolIds(resources);

    let permissionPromises = [];
    if (paths && paths.length > 0) {
        permissionPromises.push(
            getResourcePermissions(RESOURCE_PERMISSIONS_KEY, { paths })
        );
    }
    if (apps && apps.length > 0) {
        permissionPromises.push(getAppPermissions({ apps }));
    }
    if (analyses && analyses.length > 0) {
        permissionPromises.push(getAnalysisPermissions({ analyses }));
    }
    if (tools && tools.length > 0) {
        permissionPromises.push(getToolPermissions({ tools }));
    }

    return Promise.all(permissionPromises);
};

/**
 * Builds a sharing request, for use with the shareAnalyses API call,
 * to share an analysis with support.
 *
 * @param {object} supportUser - The support user object (from configs).
 * @param {string} analysis_id - ID of the analysis to share.
 */
export const getAnalysisShareWithSupportRequest = (
    supportUser,
    analysis_id
) => ({
    analysisSharingRequest: {
        sharing: [
            {
                subject: supportUser,
                analyses: [
                    {
                        analysis_id,
                        permission: Permissions.READ,
                    },
                ],
            },
        ],
    },
});
