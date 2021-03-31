import callApi from "../common/callApi";

const QUICK_LAUNCH_LISTING = "fetchQuickLaunches";
const QUICK_LAUNCH_APP_INFO = "fetchAppInfoForQuickLaunch";
const QUICK_LAUNCH_LIST_ALL = "listAllQuickLaunches";

function listAllQuickLaunches(key) {
    console.log("listAllQuickLaunches");
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "GET",
    });
}

/**
 * Add a quick launch
 * @param {object} quickLaunch
 */
function addQuickLaunch(quickLaunch) {
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "POST",
        body: quickLaunch,
    });
}

/**
 * List all quick launches for the selected app
 * @param {string} key
 * @param {object} param1
 */
function listQuickLaunches(key, { appId }) {
    return callApi({
        endpoint: `/api/quicklaunches/apps/${appId}`,
        method: "GET",
    });
}

/**
 * Delete selected quick launch
 * @param {*} qid
 */
function deleteQuickLaunch(qid) {
    return callApi({
        endpoint: `/api/quicklaunches/${qid}`,
        method: "DELETE",
    });
}

/**
 * List global quick launches
 */
function listGlobalQuickLaunches() {
    return callApi({
        endpoint: "/api/quicklaunches/defaults/global",
        method: "GET",
    });
}

/**
 * Get description of the quick launch by its UUID.
 * @param {String} qID
 */
function getQuickLaunch(qID) {
    return callApi({
        endpoint: `/api/quicklaunches/${qID}`,
        method: "GET",
    });
}

/**
 * Get app launch information for selected quick launch
 *
 * @param {*} key
 * @param {*} param1
 */
function getAppInfo(key, { qId }) {
    return callApi({
        endpoint: `/api/quicklaunches/${qId}/app-info`,
        method: "GET",
    });
}

export {
    QUICK_LAUNCH_APP_INFO,
    QUICK_LAUNCH_LISTING,
    QUICK_LAUNCH_LIST_ALL,
    listAllQuickLaunches,
    addQuickLaunch,
    listQuickLaunches,
    deleteQuickLaunch,
    listGlobalQuickLaunches,
    getQuickLaunch,
    getAppInfo,
};
