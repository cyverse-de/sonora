import callApi from "../common/callApi";


function getApps(key) {
    return callApi({
        endpoint: "/api/apps",
        method: "GET",
    })
}

export {getApps}