import callApi from "../common/callApi";

const ANALYSES_LISTING_QUERY_KEY = "fetchAnalysesListingKey";
const ANALYSIS_HISTORY_QUERY_KEY = "fetchAnalysisHistoryKey";
const ANALYSIS_PARAMS_QUERY_KEY = "fetchAnalysisParamsKey";
const ANALYSIS_RELAUNCH_QUERY_KEY = "fetchAnalysisRelaunchKey";
const ANALYSES_SEARCH_QUERY_KEY = "searchAnalysesKey";

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

function deleteAnalyses(analysisIds) {
    return callApi({
        endpoint: "/api/analyses/shredder",
        method: "POST",
        body: { analyses: analysisIds },
    });
}

function relaunchAnalyses(analysisIds) {
    return callApi({
        endpoint: "/api/analyses/relauncher",
        method: "POST",
        body: { analyses: analysisIds },
    });
}

function renameAnalyses({ id, name }) {
    return callApi({
        endpoint: `/api/analyses/${id}`,
        method: "PATCH",
        body: { name },
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

function getAnalysisRelaunchInfo(key, { id }) {
    return callApi({
        endpoint: `/api/analyses/${id}/relaunch-info`,
        method: "GET",
    });
}

export {
    getAnalyses,
    getAnalysisHistory,
    getAnalysisParameters,
    getAnalysisRelaunchInfo,
    deleteAnalyses,
    relaunchAnalyses,
    renameAnalyses,
    submitAnalysis,
    ANALYSES_LISTING_QUERY_KEY,
    ANALYSIS_HISTORY_QUERY_KEY,
    ANALYSIS_PARAMS_QUERY_KEY,
    ANALYSIS_RELAUNCH_QUERY_KEY,
    ANALYSES_SEARCH_QUERY_KEY,
};
