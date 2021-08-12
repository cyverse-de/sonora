import callApi from "common/callApi";
const ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY = "fetchAccessRequestListing";
const ACCESS_REQUEST_IN_PROGRESS = "in-progress";
const ACCESS_REQUEST_REJECTED = "rejected";
const ACCESS_REQUEST_APPROVED = "approved";
const ACCESS_REQUEST_COMPLETED = "complete";
function requestAccess(request) {
    return callApi({
        endpoint: "/api/requests/vice",
        method: "POST",
        body: request,
    });
}

function adminRequestListing({ showAllRequests }) {
    return callApi({
        endpoint: `/api/admin/requests?include-completed=${showAllRequests}&request-type=vice`,
        method: "GET",
    });
}

function adminUpdateRequestStatus({ id, status, message, concurrent_jobs }) {
    const endpoint =
        status === ACCESS_REQUEST_APPROVED
            ? `/api/admin/requests/${id}/${status}/vice`
            : `/api/admin/requests/${id}/${status}`;

    return callApi({
        endpoint,
        method: "POST",
        body: {
            message,
            concurrent_jobs,
        },
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
    ACCESS_REQUEST_COMPLETED,
};
