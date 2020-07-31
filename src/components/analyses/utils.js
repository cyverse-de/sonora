import analysisStatus from "../models/analysisStatus";
import constants from "../../constants";
import NavigationConstants from "common/NavigationConstants";

/**
 * Get the user who ran this analysis
 * @param {object} analysis
 * @returns {boolean}
 */
const getAnalysisUser = (analysis) => {
    if (!analysis) {
        return null;
    }
    return analysis.username && analysis.username.includes(constants.IPLANT)
        ? analysis.username.split("@")[0]
        : analysis.username;
};

/**
 * Check if the analysis of type VICE
 * @param {object} analysis
 * @returns {boolean}
 */
const isInteractive = (analysis) => {
    if (!analysis) {
        return false;
    }
    const status = analysis.status;
    const interactiveUrls = analysis.interactive_urls;
    return (
        (status === analysisStatus.SUBMITTED ||
            status === analysisStatus.RUNNING) &&
        interactiveUrls?.length > 0
    );
};

/**
 * Check if the user can extend the time limit
 * @param {object} analysis
 * @param {string} currentUser
 * @returns {boolean}
 */
const allowAnalysisTimeExtn = (analysis, currentUser) => {
    if (!analysis) {
        return false;
    }
    return (
        analysis.interactive_urls?.length > 0 &&
        analysis.status === analysisStatus.RUNNING &&
        currentUser === getAnalysisUser(analysis)
    );
};

/**
 * Check if the analysis is Batch
 * @param {object} analysis
 * @returns {boolean}
 */
const isBatchAnalysis = (analysis) => {
    return analysis?.batch;
};

/**
 * Check if selected analyses can be relaunched
 * @param {array} selectedAnalyses
 * @returns {boolean}
 */
const allowAnalyesRelaunch = (selectedAnalyses) => {
    if (!selectedAnalyses || selectedAnalyses.length === 0) {
        return false;
    }

    const filteredAnalyses = selectedAnalyses.filter(
        (analysis) => analysis?.app_disabled === true
    );

    return filteredAnalyses.length === 0;
};

/**
 * Builds a path to the Analysis Relaunch page for the given analysis ID.
 *
 * @param {string} analysisId The analysis ID.
 */
const getAnalysisRelaunchPage = (analysisId) =>
    `/${NavigationConstants.ANALYSES}/${analysisId}/relaunch`;

/**
 *
 * @param {string} order The analyses listing sort order, asc or desc.
 * @param {string} orderBy The analyses listing sort field.
 * @param {string} page The analyses listing page.
 * @param {string} rowsPerPage The analyses listing page size.
 * @param {string} permFilter The permission filter used to filter the analyses listing
 * @param {string} appTypeFilter The app typle filter used to filter the analyses listing
 */

const getListingPath = (
    order,
    orderBy,
    page,
    rowsPerPage,
    permFilter,
    appTypeFilter
) =>
    `/${NavigationConstants.ANALYSES}?selectedOrder=${order}&selectedOrderBy=${orderBy}&selectedPage=${page}&selectedRowsPerPage=${rowsPerPage}&selectedPermFilter=${permFilter}&selectedTypeFilter=${appTypeFilter}`;

export {
    getAnalysisUser,
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    allowAnalyesRelaunch,
    getAnalysisRelaunchPage,
    getListingPath,
};
