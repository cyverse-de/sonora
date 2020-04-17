import callApi from "../common/callApi";

function getDashboard(key, { limit }) {
    return callApi({
        endpoint: `/api/dashboard?limit=${limit}`,
        method: "GET",
    });
}

export { getDashboard };
