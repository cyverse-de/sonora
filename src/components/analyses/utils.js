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
 * Checks if the user can cancel all of the given analyses.
 *
 * @param {array} analyses
 * @param {string} currentUser
 * @returns {boolean} false if any analysis does not belong to the current user
 *  or is not in the running, idle, or submitted status.
 */
const allowAnalysesCancel = (analyses, currentUser) => {
    return (
        analyses &&
        analyses.length > 0 &&
        !analyses.find(
            (analysis) =>
                currentUser !== getAnalysisUser(analysis) ||
                (analysis.status !== analysisStatus.RUNNING &&
                    analysis.status !== analysisStatus.IDLE &&
                    analysis.status !== analysisStatus.SUBMITTED)
        )
    );
};

/**
 * Checks if the user can delete all the given analyses.
 *
 * @param {array} analyses
 * @param {string} currentUser
 * @returns {boolean} false if any analysis does not belong to the current user
 */
const allowAnalysesDelete = (analyses, currentUser) =>
    analyses &&
    analyses.length > 0 &&
    !analyses.find((analysis) => currentUser !== getAnalysisUser(analysis));

/**
 * Check if selected analyses can be relaunched
 * @param {array} selectedAnalyses
 * @returns {boolean}
 */
const allowAnalysesRelaunch = (selectedAnalyses) => {
    if (!selectedAnalyses || selectedAnalyses.length === 0) {
        return false;
    }

    const filteredAnalyses = selectedAnalyses.filter(
        (analysis) => analysis?.app_disabled === true
    );

    return filteredAnalyses.length === 0;
};

/**
 * Checks if the user can rename or update comments for the given analysis.
 *
 * @param {array} analysis
 * @param {string} currentUser
 * @returns {boolean} true if the analysis belongs to the current user
 */
const allowAnalysisEdit = (analysis, currentUser) =>
    currentUser === getAnalysisUser(analysis);

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
    allowAnalysesCancel,
    allowAnalysesDelete,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    getAnalysisRelaunchPage,
    getListingPath,
};
