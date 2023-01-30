/**
 * @author sboleyn
 *
 */

import callApi from "../common/callApi";

const PLAN_TYPES_QUERY_KEY = "fetchPlanTypes";
const SUBSCRIPTIONS_QUERY_KEY = "fetchSubscriptions";

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
        params["limit"] = rowsPerPage;
        params["offset"] = page * rowsPerPage;
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
// function updateUserQuota(quotaValue, resourceType, username){
//     return callApi({
//         endpoint: `api/admin/qms/users/${username}/plan/${resourceType}/quota`,
//         method: "POST",
//         body: {quota: quotaValue}
//     })
// }
function updateUserQuota(quota, resourceType, username) {
    return callApi({
        endpoint: `/api/admin/qms/users/${username}/plan/${resourceType}/quota`,
        method: "POST",
        body: quota,
    });
}

export {
    getPlanTypes,
    getSubscriptions,
    postSubscription,
    updateUserQuota,
    PLAN_TYPES_QUERY_KEY,
    SUBSCRIPTIONS_QUERY_KEY,
};
