import callApi from "../common/callApi";

function getAnalyses(key, { rowsPerPage, orderBy, order, page, filter }) {
    return callApi({
        endpoint: `/api/analyses?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }&filter=[${filter}]`,
        method: "GET",
    });
}

function submitAnalysis(submission) {
    return callApi({
        endpoint: "/api/analyses",
        method: "POST",
        body: submission,
    });
}

function getAnalysisHistory(key, { id }) {
    return callApi({
        endpoint: `/api/analyses/${id}/history`,
        method: "GET",
    });
}

function getAnalysisParameters(key, { id }) {
    return callApi({
        endpoint: `/api/analyses/${id}/parameters`,
        method: "GET",
    });
}

export {
    getAnalyses,
    getAnalysisHistory,
    getAnalysisParameters,
    submitAnalysis,
};
