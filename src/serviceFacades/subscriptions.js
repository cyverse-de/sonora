/**
 * @author sboleyn
 *
 */

import callApi from "../common/callApi";

const AVAILABLE_ADDONS_QUERY_KEY = "fetchAvailableAddons";
const PLAN_TYPES_QUERY_KEY = "fetchPlanTypes";
const RESOURCE_TYPES_QUERY_KEY = "fetchResourceTypes";
const SUBSCRIPTION_ADDONS_QUERY_KEY = "fetchSubscriptionAddons";
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

// Get resource types
function getResourceTypes() {
    return callApi({
        endpoint: `/api/qms/resource-types`,
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

// List the add-ons to a user's subscription
function getSubscriptionAddons(subscription_uuid) {
    return callApi({
        endpoint: `/api/admin/qms/subscriptions/${subscription_uuid}/addons`,
        method: "GET",
    });
}

// Adminstrators can update an available add-on
function putAddon(addon) {
    return callApi({
        endpoint: `/api/admin/qms/addons`,
        method: "PUT",
        body: addon,
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

// Administrators can create an available add-on
function postAddon(addon) {
    return callApi({
        endpoint: `/api/admin/qms/addons`,
        method: "POST",
        body: addon,
    });
}

export {
    getAvailableAddOns,
    getPlanTypes,
    getResourceTypes,
    getSubscriptionAddons,
    getSubscriptions,
    postAddon,
    postSubscription,
    putAddon,
    updateUserQuotas,
    AVAILABLE_ADDONS_QUERY_KEY,
    PLAN_TYPES_QUERY_KEY,
    RESOURCE_TYPES_QUERY_KEY,
    SUBSCRIPTION_ADDONS_QUERY_KEY,
    SUBSCRIPTIONS_QUERY_KEY,
};
