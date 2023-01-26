/**
 * @author sboleyn
 *
 */

import callApi from "../common/callApi";

const PLAN_TYPES_QUERY_KEY = "fetchPlanTypes";
const SUBSCRIPTIONS_QUERY_KEY = "fetchSubscriptions";

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

// Administrators can update a user's subscription
// function updateSubscription ({username, planName}){
//     return callApi({
//         endpoint: `/api/admin/qms/users/${username}/plan/${planName}`,
//         method: "PUT"
//     })
// }

// Administrators can add new subscriptions for users who haven't logged into the DE yet
function postSubscription(subscription) {
    return callApi({
        endpoint: `/api/admin/qms/subscriptions`,
        method: "POST",
        body: { subscriptions: [subscription] },
    });
}

// Get plan names
function getPlanTypes() {
    return callApi({
        endpoint: `/api/qms/plans`,
        method: "GET",
    });
}

// Get all users
// function getUsers(){
//     return callApi({
//         endpoint: `/api/subjects`,
//         method: "GET"
//     })
// }

export {
    postSubscription,
    getPlanTypes,
    getSubscriptions,
    PLAN_TYPES_QUERY_KEY,
    SUBSCRIPTIONS_QUERY_KEY,
};
