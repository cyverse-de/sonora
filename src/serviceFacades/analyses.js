import callApi from "../common/callApi";

import AnalysisStatus from "components/models/analysisStatus";
import AppType from "components/models/AppType";
import { useQuery } from "react-query";

const ANALYSES_LISTING_QUERY_KEY = "fetchAnalysesListingKey";
const ANALYSIS_HISTORY_QUERY_KEY = "fetchAnalysisHistoryKey";
const ANALYSIS_PARAMS_QUERY_KEY = "fetchAnalysisParamsKey";
const ANALYSIS_RELAUNCH_QUERY_KEY = "fetchAnalysisRelaunchKey";
const ANALYSES_SEARCH_QUERY_KEY = "searchAnalysesKey";

function getAnalyses(key, { rowsPerPage, orderBy, order, page, filter }) {
    const params = {};

    if (rowsPerPage) {
        params["limit"] = rowsPerPage;
    }
    if (orderBy) {
        params["sort-field"] = orderBy;
    }
    if (order) {
        params["sort-dir"] = order.toUpperCase();
    }
    if (page) {
        params["offset"] = rowsPerPage * page;
    }
    if (filter) {
        params["filter"] = filter;
    }

    return callApi({
        endpoint: "/api/analyses",
        method: "GET",
        params,
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
        }&filter=${filter}`,
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

const runningViceJobsFilter = [
    { field: "status", value: AnalysisStatus.RUNNING },
    { field: "type", value: AppType.interactive.value },
    { field: "ownership", value: "mine" },
];

const RUNNING_VICE_JOBS_QUERY_KEY = [
    ANALYSES_LISTING_QUERY_KEY,
    { filter: JSON.stringify(runningViceJobsFilter) },
];

function useRunningViceJobs({ enabled, onSuccess, onError }) {
    return useQuery({
        queryKey: RUNNING_VICE_JOBS_QUERY_KEY,
        queryFn: getAnalyses,
        config: {
            enabled,
            onSuccess,
            onError,
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    });
}

export {
    cancelAnalyses,
    cancelAnalysis,
    getAnalyses,
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
    useRunningViceJobs,
    ANALYSES_LISTING_QUERY_KEY,
    ANALYSIS_HISTORY_QUERY_KEY,
    ANALYSIS_PARAMS_QUERY_KEY,
    ANALYSIS_RELAUNCH_QUERY_KEY,
    ANALYSES_SEARCH_QUERY_KEY,
    RUNNING_VICE_JOBS_QUERY_KEY,
};
