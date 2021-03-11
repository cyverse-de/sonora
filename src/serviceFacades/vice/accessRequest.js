import callApi from "common/callApi";
const ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY = "fetchAccessRequestListing";
const ACCESS_REQUEST_IN_PROGRESS = "in-progress";
const ACCESS_REQUEST_REJECTED = "rejected";
const ACCESS_REQUEST_APPROVED = "approved";
function requestAccess(request) {
    return callApi({
        endpoint: "/api/requests/vice",
        method: "POST",
        body: request,
    });
}

function adminRequestListing() {
    return callApi({
        endpoint:
            "/api/admin/requests?include-completed=true&request-type=vice",
        method: "GET",
    });
}

function adminUpdateRequestStatus(id, status) {
    return callApi({
        endpoint: `/api/admin/requests/${id}/${status}`,
        method: "POST",
    });
}

export {
    requestAccess,
    adminRequestListing,
    adminUpdateRequestStatus,
    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY,
    ACCESS_REQUEST_IN_PROGRESS,
    ACCESS_REQUEST_REJECTED,
    ACCESS_REQUEST_APPROVED,
};
