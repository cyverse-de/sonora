import callApi from "../common/callApi";

const DASHBOARD_QUERY_KEY = "fetchDashboardItems";
const DATA_USAGE_QUERY_KEY = "fetchDataUsage";
const ANALYSES_STATS_QUERY_KEY = "fetchAnalysesStats";

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

function getAnalysesStats() {
    const params = {};
    const own_filter = {
        field: "ownership",
        value: "mine",
    };
    params.filter = JSON.stringify([own_filter]);
    params["include-deleted"] = true;
    return callApi({
        endpoint: "/api/analyses/stats",
        method: "GET",
        params,
    });
}

export {
    getDashboard,
    getDataUsage,
    getAnalysesStats,
    DASHBOARD_QUERY_KEY,
    DATA_USAGE_QUERY_KEY,
    ANALYSES_STATS_QUERY_KEY,
};
