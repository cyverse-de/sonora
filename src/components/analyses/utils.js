import analysisStatus from "../models/analysisStatus";
import constants from "../../constants";
import NavigationConstants from "common/NavigationConstants";
import { getUserName } from "components/utils/getUserName";

/**
 * Get the user who ran this analysis
 * @param {object} analysis
 * @param {object} config
 * @returns {boolean}
 */
const getAnalysisUser = (analysis, config) => {
    if (!analysis) {
        return null;
    }
    return getUserName(analysis.username, config);
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
 * Check if the analysis of type VICE
 * @param {object} analysis
 * @returns {boolean}
 */
const isInteractiveRunning = (analysis) => {
    if (!analysis) {
        return false;
    }

    return (
        analysis.interactive_urls?.length > 0 &&
        analysis.status === analysisStatus.RUNNING
    );
};

/**
 * Check if the user can extend the time limit
 * @param {object} analysis
 * @param {string} currentUser
 * @param {object} config
 * @returns {boolean}
 */
const allowAnalysisTimeExtn = (analysis, currentUser, config) => {
    return (
        isInteractiveRunning(analysis) &&
        currentUser === getAnalysisUser(analysis, config)
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
 * @param {object} config
 * @returns {boolean} false if any analysis does not belong to the current user
 *  or is not in the running, idle, or submitted status.
 */
const allowAnalysesCancel = (analyses, currentUser, config) => {
    return (
        analyses &&
        analyses.length > 0 &&
        !analyses.find(
            (analysis) =>
                currentUser !== getAnalysisUser(analysis, config) ||
                (analysis?.status !== analysisStatus.RUNNING &&
                    analysis?.status !== analysisStatus.IDLE &&
                    analysis?.status !== analysisStatus.SUBMITTED)
        )
    );
};

/**
 * Checks if the user can delete all the given analyses.
 *
 * @param {array} analyses
 * @param {string} currentUser
 * @param {object} config
 * @returns {boolean} false if any analysis does not belong to the current user
 */
const allowAnalysesDelete = (analyses, currentUser, config) =>
    analyses &&
    analyses.length > 0 &&
    !analyses.find(
        (analysis) => currentUser !== getAnalysisUser(analysis, config)
    );

/**
 * Check if selected analyses can be relaunched
 * @param {array} selectedAnalyses
 * @returns {boolean}
 */
const allowAnalysesRelaunch = (selectedAnalyses) => {
    if (!selectedAnalyses || selectedAnalyses.length === 0) {
        return false;
    }

    const filteredAnalyses = selectedAnalyses?.filter(
        (analysis) => analysis?.app_disabled === true
    );

    return filteredAnalyses.length === 0;
};

/**
 * Checks if the user can rename or update comments for the given analysis.
 *
 * @param {array} analysis
 * @param {string} currentUser
 * @param {object} config
 * @returns {boolean} true if the analysis belongs to the current user
 */
const allowAnalysisEdit = (analysis, currentUser, config) =>
    currentUser === getAnalysisUser(analysis, config);

/**
 * Builds `href` and `as` paths for use in an analysis details next/link
 *
 * @param {string} analysisId - analysis ID
 *
 * @return {array} [href, as] to be used in next/link
 */
const getAnalysisDetailsLinkRefs = (analysisId) => {
    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${analysisId}`;

    return [href, as];
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
 * @param {string} appTypeFilter The app type filter used to filter the analyses listing
 */

const getListingPath = (
    order,
    orderBy,
    page,
    rowsPerPage,
    permFilter,
    appTypeFilter,
    idFilter
) => {
    return {
        pathname: `/${NavigationConstants.ANALYSES}`,
        query: {
            selectedOrder: order,
            selectedOrderBy: orderBy,
            selectedPage: page,
            selectedRowsPerPage: rowsPerPage,
            selectedPermFilter: permFilter,
            selectedTypeFilter: appTypeFilter,
            selectedIdFilter: idFilter,
        },
    };
};

/**
 * Open a new tab / window with VICE access url is clicked
 * @param {*} url
 */
const openInteractiveUrl = (url) => {
    window.open(`/vice/${encodeURIComponent(url)}`, "_blank");
};

/**
 * A custom hook to get `href` and `as` for using with analysis relaunch next/link
 *
 * @param {object} analysis - selected analysis for relaunch
 *
 * @return {array} href and as to be used in next/link
 */
const useRelaunchLink = (analysis) => {
    const href = `/${NavigationConstants.ANALYSES}/[analysisId]/relaunch`;
    const as = `/${NavigationConstants.ANALYSES}/${analysis?.id}/relaunch`;
    return [href, as];
};

const useGotoOutputFolderLink = (resultfolderid) => {
    const href = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}/[...pathItems]`;
    const as = `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${resultfolderid}`;
    return [href, as];
};

const canShare = (selectedAnalyses) => {
    return (
        selectedAnalyses &&
        selectedAnalyses.length > 0 &&
        !selectedAnalyses.find((analysis) => !analysis?.can_share)
    );
};

const ANALYSIS_TERMINAL_STATES = [
    analysisStatus.CANCELED,
    analysisStatus.COMPLETED,
    analysisStatus.FAILED,
    analysisStatus.REMOVED,
];

/**
 * Checks if the analysis is in one of the terminal states
 * @param {object} analysis
 * @returns {boolean}
 */
const isTerminated = (analysis) => {
    const status = analysis?.status || analysis?.analysisstatus;
    return ANALYSIS_TERMINAL_STATES.includes(status);
};

export {
    getAnalysisUser,
    isInteractive,
    isInteractiveRunning,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    allowAnalysesCancel,
    allowAnalysesDelete,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    canShare,
    getAnalysisDetailsLinkRefs,
    getAnalysisRelaunchPage,
    getListingPath,
    isTerminated,
    openInteractiveUrl,
    useRelaunchLink,
    useGotoOutputFolderLink,
    ANALYSIS_TERMINAL_STATES,
};
