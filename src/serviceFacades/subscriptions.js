/**
 * @author sboleyn
 *
 */
import callApi from "../common/callApi";

const SUBSCRIPTION_LISTING_QUERY_KEY = "searchSubscriptionsAdminQMS";

// ****Requirements****
// 2. Administrators can update a user's subscrption

// 3. Administrators can add new subscriptions for users who haven't logged into the DE yet

// Remove after testing
// function getTest() {
//     return getFeaturedApps();
// }

// ****Requirement 1****
// Administrators can list existing subscriptions
function getSubscriptions() {
    return callApi({
        endpoint: "/api/admin/qms/subscriptions",
        method: "GET",
    });
}

// function getSubs({ rowsPerPage, orderBy, order, page, appTypeFilter })
// function getSubs(){
//     return callApi({
//         endpoint: `api/terrain/admin/qms/subscriptions`,
//         method: "GET"
//     })
// }

export { getSubscriptions, SUBSCRIPTION_LISTING_QUERY_KEY };
