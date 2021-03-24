import callApi from "../common/callApi";

import AnalysisStatus from "components/models/analysisStatus";

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

function getAnalysis(id) {
    const filter = JSON.stringify({ field: "id", value: id });
    return callApi({
        endpoint: `/api/analyses?filter=[${filter}]`,
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

function renameAnalysis({ id, name }) {
    return callApi({
        endpoint: `/api/analyses/${id}`,
        method: "PATCH",
        body: { name },
    });
}

function updateAnalysisComment({ id, description }) {
    return callApi({
        endpoint: `/api/analyses/${id}`,
        method: "PATCH",
        body: { description },
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
/**
 * Search Analyses
 * @param {string} key - react-query key
 * @param {object} param - parameters for searching analyses.
 * @param {integer} page - the page to retrieve. The last parameter must be the page number as required by react-query useInfiniteQuery.
 */
function searchAnalysesInfinite(
    key,
    { rowsPerPage, orderBy, order, filter },
    page = 0
) {
    return callApi({
        endpoint: `/api/analyses?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }&filter=[${filter}]`,
        method: "GET",
    });
}

function cancelAnalysis({ id, job_status }) {
    return callApi({
        endpoint: `/api/analyses/${id}/stop`,
        method: "POST",
        params: { job_status },
    });
}

function cancelAnalyses({
    ids: analysisIds,
    job_status = AnalysisStatus.CANCELED,
}) {
    return (
        analysisIds &&
        analysisIds.length > 0 &&
        new Promise((resolve, reject) =>
            Promise.all(
                analysisIds.map((id) => cancelAnalysis({ id, job_status }))
            )
                .then((values) => resolve(values))
                .catch((error) => reject(error))
        )
    );
}

function getAnalysisPermissions({ analyses }) {
    return callApi({
        endpoint: `/api/analyses/permission-lister`,
        method: "POST",
        body: {
            analyses,
        },
    });
}

export {
    cancelAnalyses,
    cancelAnalysis,
    getAnalyses,
    getAnalysis,
    getAnalysisHistory,
    getAnalysisParameters,
    getAnalysisRelaunchInfo,
    getAnalysisPermissions,
    deleteAnalyses,
    relaunchAnalyses,
    renameAnalysis,
    submitAnalysis,
    updateAnalysisComment,
    searchAnalysesInfinite,
    ANALYSES_LISTING_QUERY_KEY,
    ANALYSIS_HISTORY_QUERY_KEY,
    ANALYSIS_PARAMS_QUERY_KEY,
    ANALYSIS_RELAUNCH_QUERY_KEY,
    ANALYSES_SEARCH_QUERY_KEY,
};
