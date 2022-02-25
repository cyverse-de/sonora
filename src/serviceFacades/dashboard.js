import callApi from "../common/callApi";

const DASHBOARD_QUERY_KEY = "fetchDashboardItems";
const ANALYSES_STATS_QUERY_KEY = "fetchAnalysesStats";
const RESOURCE_USAGE_QUERY_KEY = "fetchResourceUsage";
function getDashboard({ limit }) {
    return callApi({
        endpoint: `/api/dashboard?limit=${limit}`,
        method: "GET",
    });
}

function getResourceUsageSummary() {
    return callApi({
        endpoint: `/api/resource-usage/summary`,
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
    getAnalysesStats,
    getResourceUsageSummary,
    DASHBOARD_QUERY_KEY,
    ANALYSES_STATS_QUERY_KEY,
    RESOURCE_USAGE_QUERY_KEY,
};
