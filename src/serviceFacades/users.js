import callApi from "../common/callApi";
import { useQuery, useMutation } from "react-query";

const BOOTSTRAP_KEY = "bootstrap";

/**
 * Get user information including name, institution, email, etc.
 * @param userIds An array of user ids
 * @returns {Promise<any>}
 */

const USER_PROFILE_QUERY_KEY = "fetchUserProfile";
const REDIRECT_URI_QUERY_KEY = "fetchRedirectURI";
const WEBHOOKS_TYPES_QUERY_KEY = "fetchHookTypes";
const WEBHOOKS_TOPICS_QUERY_KEY = "fetchHookTopics";
const WEBHOOK_TEST_KEY = "testWebhook";
const USER_PORTAL_QUERY_KEY = "fetchUserPortalStatus";

const getUserInfo = ({ userIds }) => {
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

function bootstrap() {
    return callApi({
        endpoint: `/api/bootstrap`,
        method: "GET",
        credentials: "include",
    });
}

function savePreferences({ preferences, webhooks }) {
    let promises = [];

    const prefPromise = callApi({
        endpoint: "/api/preferences",
        method: "POST",
        body: preferences,
    });
    promises.push(prefPromise);

    const hookPromise = updateWebhooks(webhooks ? webhooks : null);
    promises.push(hookPromise);

    return Promise.all(promises);
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

function getWebhookTypes() {
    return callApi({
        endpoint: `/api/webhooks/types`,
        method: "GET",
        credentials: "include",
    });
}

function getWebhookTopics() {
    return callApi({
        endpoint: `/api/webhooks/topics`,
        method: "GET",
        credentials: "include",
    });
}

function updateWebhooks(webhooks) {
    return callApi({
        endpoint: `/api/webhooks`,
        method: "PUT",
        body: webhooks ? webhooks : { webhooks: [] },
    });
}

function testWebhook({ url }) {
    return callApi({
        endpoint: `/api/testWebhook?url=${url}`,
        method: "GET",
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
        enabled,
        onSuccess,
        onError,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: 3,
        //copied from react-query doc. Add exponential delay for retry.
        retryDelay: (attempt) =>
            Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
    });
}

function getUserPortalStatus(userId) {
    return callApi({
        endpoint: `/api/users/${userId}/status`,
        method: "GET",
    });
}

function usePortalStatus(userId, onError) {
    return useQuery({
        queryKey: [USER_PORTAL_QUERY_KEY, userId],
        queryFn: () => getUserPortalStatus(userId),
        enabled: !!userId,
        onError,
        staleTime: Infinity,
        cacheTime: Infinity,
    });
}

/**
 * Query to save preferences
 * @param {Function} onSuccessCallback - Callback function to use when query succeeds.
 * @param {Function} onError - Callback function to use when query failed.
 */
function useSavePreferences(
    bootstrapInfo,
    setBootstrapInfo,
    onSuccessCallback,
    onError
) {
    return useMutation(savePreferences, {
        onSuccess: (updatedPref) => {
            //update preference in cache
            if (updatedPref && updatedPref[0].preferences) {
                const updatePref = updatedPref[0].preferences;
                const updatedBootstrap = {
                    ...bootstrapInfo,
                    preferences: { ...updatePref },
                };
                setBootstrapInfo(updatedBootstrap);
            }

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
    WEBHOOKS_TOPICS_QUERY_KEY,
    WEBHOOKS_TYPES_QUERY_KEY,
    WEBHOOK_TEST_KEY,
    getUserInfo,
    getUserProfile,
    bootstrap,
    savePreferences,
    resetToken,
    getRedirectURIs,
    useBootStrap,
    useSavePreferences,
    feedback,
    getWebhookTypes,
    getWebhookTopics,
    testWebhook,
    usePortalStatus,
};
