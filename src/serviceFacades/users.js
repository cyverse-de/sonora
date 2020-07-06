import callApi from "../common/callApi";

const BOOTSTRAP_KEY = "bootstrap";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */
export const USER_PROFILE_QUERY_KEY = "fetchUserProfile";

export const getUserInfo = ({ userIds }) => {
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

function bootstrap(key, { ip }) {
    return callApi({
        endpoint: `/api/bootstrap?ip-address=${ip}`,
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
    getUserInfo,
    getUserProfile,
    bootstrap,
    savePreferences,
    resetToken,
    getRedirectURIs,
};
