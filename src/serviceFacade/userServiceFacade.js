import callApi from "../common/callApi";

function getUserProfile(key) {
    return callApi({
        endpoint: "/api/profile",
        method: "GET",
        credentials: "include",
    });
}

export { getUserProfile };
