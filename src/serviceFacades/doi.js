import callApi from "../common/callApi";
const DOI_LISTING_QUERY_KEY = "fetchDOIListing";
function adminGetDOIRequests(key, { rowsPerPage, orderBy, order, page }) {
    return callApi({
        endpoint: `/api/admin/permanent-id-requests?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }`,
        method: "GET",
    });
}

export { adminGetDOIRequests, DOI_LISTING_QUERY_KEY };
