import callApi from "../common/callApi";

function addQuickLaunch(quickLaunch) {
    return callApi({
        endpoint: "/api/quicklaunches",
        method: "POST",
        body: quickLaunch,
    });
}

export { addQuickLaunch };
