import callApi from "../common/callApi";
import { useQuery, useMutation, queryCache } from "react-query";

const BOOTSTRAP_KEY = "bootstrap";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */

const USER_PROFILE_QUERY_KEY = "fetchUserProfile";
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

/**
 * Query to get user bootstrap and preferences
 * @param {boolean} enabled - Enabled / disable this query.
 * @param {Function} onSuccess - Callback function to use when query succeeds.
 * @param {Function} onError - Callback function to use when query failed.
 */
function useBootStrap(enabled, onSuccess, onError) {
    return useQuery({
        queryKey: BOOTSTRAP_KEY,
        queryFn: bootstrap,
        config: {
            enabled,
            onSuccess,
            onError,
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: 3,
            //copied from react-query doc. Add exponential delay for retry.
            retryDelay: (attempt) =>
                Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
        },
    });
}
/**
 * Query to save preferences
 * @param {Function} onSuccessCallback - Callback function to use when query succeeds.
 * @param {Function} onError - Callback function to use when query failed.
 */
function useSavePreferences(onSuccessCallback, onError) {
    return useMutation(savePreferences, {
        onSuccess: (updatedPref) => {
            //update preference in cache
            queryCache.setQueryData(BOOTSTRAP_KEY, (bootstrapData) => {
                if (bootstrapData && updatedPref) {
                    const updatedBootstrap = {
                        ...bootstrapData,
                        preferences: { ...updatedPref.preferences },
                    };
                    return updatedBootstrap;
                } else {
                    return bootstrapData;
                }
            });
            if (onSuccessCallback) {
                onSuccessCallback(updatedPref);
            }
        },
        onError,
    });
}

function feedback(userFeedback) {
    return callApi({
        endpoint: "/api/support-email",
        method: "POST",
        body: userFeedback,
    });
}

export {
    BOOTSTRAP_KEY,
    USER_PROFILE_QUERY_KEY,
    REDIRECT_URI_QUERY_KEY,
    getUserInfo,
    getUserProfile,
    bootstrap,
    savePreferences,
    resetToken,
    getRedirectURIs,
    useBootStrap,
    useSavePreferences,
    feedback,
};
