export const ANALYSIS_OUTPUT_DIR = "/iplant/home/aramsey/analyses_qa";
export const STARTING_PATH = "/iplant/home/aramsey";

export const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};

export const createSavedLaunch = submitAnalysis;
