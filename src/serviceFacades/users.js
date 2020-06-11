import callApi from "../common/callApi";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */
const getUserInfo = ({ userIds }) => {
    const userQuery = userIds.join("&username=");

    return callApi({
        endpoint: `/api/user-info?username=${userQuery}`,
    });
};

function getUserProfile(key) {
    return callApi({
        endpoint: "/api/profile",
        method: "GET",
        credentials: "include",
    });
}

function bootstrap(key) {
    return callApi({
        endpoint: "/api/bootstrap?ip-address=127.0.0.1",
        method: "GET",
        credentials: "include",
    });
}

export { getUserInfo, getUserProfile, bootstrap };
