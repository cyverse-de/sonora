/**
 * @author sboleyn
 *
 */

import callApi from "../common/callApi";

const SUBSCRIPTIONS_QUERY_KEY = "searchSubscriptionsAdminQMS";

// Administrators can list existing subscriptions
function getSubscriptions({ searchTerm, order, orderBy }) {
    const params = {};
    const isOrdered = order && orderBy;

    if (searchTerm) {
        params["search"] = searchTerm;
    }

    if (isOrdered) {
        params["sort-field"] = orderBy.toLowerCase();
        params["sort-dir"] = order.toUpperCase();
    }

    // console.log(params);
    return callApi({
        endpoint: "/api/admin/qms/subscriptions",
        method: "GET",
        params: params,
    });
}

// Administrators can update a user's subscriptions
// function updateSubscription ({username, planName}){
//     return callApi({
//         endpoint: `/api/admin/qms/users/${username}/plan/${planName}`,
//         method: "PUT"
//     })
// }

// Administrators can add new subscriptions for users who haven't logged into the DE yet
// function addNewSubscription ({request}){
//     return callApi({
//         endpoint: `/api/admin/qms/subscriptions`,
//         method: "POST",
//         body: request
//     })
// }

// Get plan names
// function getPlanNames(){
//     return callApi({
//         endpoint: `/api/qms/plans`,
//         method: "GET"
//     })
// }

// Get all users
// function getUsers(){
//     return callApi({
//         endpoint: `/api/subjects`,
//         method: "GET"
//     })
// }

export { getSubscriptions, SUBSCRIPTIONS_QUERY_KEY };
