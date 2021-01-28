import callApi from "../common/callApi";
function adminGetDOIRequests(key) {
    return callApi({
        endpoint: `/api/admin/permanent-id-requests`,
        method: "GET",
    });
}

export { adminGetDOIRequests };
