export const ANALYSIS_OUTPUT_DIR = "/iplant/home/dev/analyses_qa";

export const ONE_GB = 1024 * 1024 * 1024;

export const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};
