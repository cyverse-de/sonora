import callApi from "../common/callApi";

const DASHBOARD_QUERY_KEY = "fetchDashboardItems";

function getDashboard({ limit }) {
    return callApi({
        endpoint: `/api/dashboard?limit=${limit}`,
        method: "GET",
    });
}

export { getDashboard, DASHBOARD_QUERY_KEY };
