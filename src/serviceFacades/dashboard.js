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
    return callApi({
        endpoint: `/api/resource-usage/data/current`,
        method: "GET",
    });
}

export {
    getDashboard,
    getDataUsage,
    DASHBOARD_QUERY_KEY,
    DATA_USAGE_QUERY_KEY,
};
