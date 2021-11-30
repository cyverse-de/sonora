import callApi from "../common/callApi";

const DASHBOARD_QUERY_KEY = "fetchDashboardItems";
const DATA_USAGE_QUERY_KEY = "fetchDataUsage";

function getDashboard({ limit }) {
    return callApi({
        endpoint: `/api/dashboard?limit=${limit}`,
        method: "GET",
    });
}

function getDataUsage() {
    //return callApi({  endpoint: `/api/resource-usage/data/total`,
    //    method: "GET", });
    return Promise.resolve({
        id: "123456789",
        user_id: "sriram",
        username: "sriram@iplantcollaborative.org",
        total: 16106127360,
        time: "2021-11-19T16:39:57-07:00",
        last_modified: "2021-11-19T16:39:57-07:00",
    });
}

export {
    getDashboard,
    getDataUsage,
    DASHBOARD_QUERY_KEY,
    DATA_USAGE_QUERY_KEY,
};
