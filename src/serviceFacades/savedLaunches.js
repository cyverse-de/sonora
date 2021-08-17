import callApi from "../common/callApi";

const SAVED_LAUNCH_LISTING = "fetchSavedLaunches";
const SAVED_LAUNCH_APP_INFO = "fetchAppInfoForSavedLaunch";

function listAllSavedLaunches() {
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "GET",
    });
}

/**
 * Add a saved launch
 * @param {object} savedLaunch
 */
function addSavedLaunch(savedLaunch) {
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "POST",
        body: savedLaunch,
    });
}

/**
 * List all saved launches for the selected app
 * @param {string} key
 * @param {object} app
 */
function listSavedLaunches(key, { appId }) {
    return callApi({
        endpoint: `/api/quicklaunches/apps/${appId}`,
        method: "GET",
    });
}

/**
 * Delete selected saved launch
 * @param {*} launchId
 */
function deleteSavedLaunch(launchId) {
    return callApi({
        endpoint: `/api/quicklaunches/${launchId}`,
        method: "DELETE",
    });
}

/**
 * Adds the saved launch as a global default.
 * @param {string} id
 * @param {string} app_id
 */
function addGlobalSavedLaunch({ id, app_id }) {
    const body = {
        app_id,
        quick_launch_id: id,
    };
    return callApi({
        endpoint: `/api/quicklaunches/defaults/global`,
        method: "POST",
        body,
    });
}

/**
 * Get description of the saved launch by its UUID.
 * @param {String} launchId
 */
function getSavedLaunch(launchId) {
    return callApi({
        endpoint: `/api/quicklaunches/${launchId}`,
        method: "GET",
    });
}

/**
 * Get app launch information for selected saved launch
 *
 * @param {*} key
 * @param {*} param1
 */
function getAppInfo(key, { launchId }) {
    return callApi({
        endpoint: `/api/quicklaunches/${launchId}/app-info`,
        method: "GET",
    });
}

export {
    SAVED_LAUNCH_APP_INFO,
    SAVED_LAUNCH_LISTING,
    listAllSavedLaunches,
    addSavedLaunch,
    listSavedLaunches,
    deleteSavedLaunch,
    addGlobalSavedLaunch,
    getSavedLaunch,
    getAppInfo,
};
