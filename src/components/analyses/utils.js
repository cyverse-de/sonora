import analysisStatus from "../models/analysisStatus";
import constants from "../../constants";

/**
 * Get the user who ran this analysis
 * @param {*} analysis
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
 * @param {*} analysis
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
        interactiveUrls &&
        interactiveUrls.length > 0
    );
};

/**
 * Check if the user can extend the time limit
 * @param {*} analysis
 * @param {*} currentUser
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
 * @param {*} analysis
 * @returns {boolean}
 */
const isBatchAnalysis = (analysis) => {
    if (!analysis) {
        return false;
    }
    return analysis.batch;
};

export {
    getAnalysisUser,
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
};
