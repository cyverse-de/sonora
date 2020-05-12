import callApi from "../common/callApi";

function getAnalyses(key, { rowsPerPage, orderBy, order, page, filter }) {
    return callApi({
        endpoint: `/api/analyses?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }&filter=[${filter}]`,
        method: "GET",
    });
}

export { getAnalyses };
