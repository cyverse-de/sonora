import callApi from "../common/callApi";

function addQuickLaunch(quickLaunch) {
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "POST",
        body: quickLaunch,
    });
}

function listQuickLaunches(key, { appId }) {
    return callApi({
        endpoint: `/api/quicklaunches/apps/${appId}`,
        method: "GET",
    });
}

export { addQuickLaunch, listQuickLaunches };
