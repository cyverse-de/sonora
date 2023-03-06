/**
 * @author sboleyn
 *
 */

import callApi from "../common/callApi";

const PLAN_TYPES_QUERY_KEY = "fetchPlanTypes";
const AVAILABLE_ADDONS_QUERY_KEY = "fetchAvailableAddons";
const SUBSCRIPTIONS_QUERY_KEY = "fetchSubscriptions";

// Get available add-ons
function getAvailableAddOns() {
    return callApi({
        endpoint: `/api/admin/qms/addons`,
        method: "GET",
    });
}
// Get plan names
function getPlanTypes() {
    return callApi({
        endpoint: `/api/qms/plans`,
        method: "GET",
    });
}

// Administrators can list existing subscriptions
function getSubscriptions({ searchTerm, order, orderBy, page, rowsPerPage }) {
    const params = {};
    const isOrdered = order && orderBy;
    const isPaginated = (page || page === 0) && rowsPerPage;

    if (searchTerm) {
        params["search"] = searchTerm;
    }

    if (isOrdered) {
        params["sort-field"] = orderBy.toLowerCase();
        params["sort-dir"] = order.toUpperCase();
    }

    if (isPaginated) {
        params.limit = rowsPerPage;
        params.offset = page * rowsPerPage;
    }

    return callApi({
        endpoint: "/api/admin/qms/subscriptions",
        method: "GET",
        params: params,
    });
}

// Administrators can add new subscriptions for users who haven't logged into the DE yet
// Administrators can edit existing subscriptions
function postSubscription(subscription) {
    return callApi({
        endpoint: `/api/admin/qms/subscriptions`,
        method: "POST",
        body: { subscriptions: [subscription] },
    });
}

// Administrators can update user quotas for a specified resource type
function updateUserQuota(quota, resourceType, username) {
    return callApi({
        endpoint: `/api/admin/qms/users/${username}/plan/${resourceType}/quota`,
        method: "POST",
        body: quota,
    });
}

function updateUserQuotas(quotas, username) {
    return (
        quotas &&
        quotas.length > 0 &&
        Promise.all(
            quotas.map((resource) =>
                updateUserQuota(
                    { quota: resource.quota },
                    resource.resource_type.name,
                    username
                )
            )
        )
    );
}

export {
    getAvailableAddOns,
    getPlanTypes,
    getSubscriptions,
    postSubscription,
    updateUserQuotas,
    AVAILABLE_ADDONS_QUERY_KEY,
    PLAN_TYPES_QUERY_KEY,
    SUBSCRIPTIONS_QUERY_KEY,
};
