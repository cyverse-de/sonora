import callApi from "../common/callApi";

const BOOTSTRAP_KEY = "bootstrap";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */

const USER_PROFILE_QUERY_KEY = "fetchUserProfile";
const USER_PROFILE_REFETCH_INTERVAL = 5000;
const REDIRECT_URI_QUERY_KEY = "fetchRedirectURI";

const getUserInfo = (key, { userIds }) => {
    const userQuery = userIds.join("&username=");

    return callApi({
        endpoint: `/api/user-info?username=${userQuery}`,
    });
};

function getUserProfile() {
    return callApi({
        endpoint: "/api/profile",
        method: "GET",
        credentials: "include",
    });
}

function bootstrap(key) {
    return callApi({
        endpoint: `/api/bootstrap`,
        method: "GET",
        credentials: "include",
    });
}

function savePreferences(preferences) {
    return callApi({
        endpoint: "/api/preferences",
        method: "POST",
        body: preferences,
    });
}

function resetToken({ systemId }) {
    return callApi({
        endpoint: `/api/token-info/${systemId}`,
        method: "DELETE",
        credentials: "include",
    });
}

function getRedirectURIs() {
    return callApi({
        endpoint: "/api/redirect-uris",
        method: "GET",
        credentials: "include",
    });
}

export {
    BOOTSTRAP_KEY,
    USER_PROFILE_QUERY_KEY,
    USER_PROFILE_REFETCH_INTERVAL,
    REDIRECT_URI_QUERY_KEY,
    getUserInfo,
    getUserProfile,
    bootstrap,
    savePreferences,
    resetToken,
    getRedirectURIs,
};
