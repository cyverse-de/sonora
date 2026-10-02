import constants from "../../../src/constants";

export const ANALYSIS_OUTPUT_DIR = "/iplant/home/aramsey/analyses_qa";
export const STARTING_PATH = "/iplant/home/aramsey";

export const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};

export const createSavedLaunch = submitAnalysis;

export const mockResourcePresets = [
    {
        id: "preset-small",
        label: "Small",
        max_cpu_cores: 2,
        min_memory_limit: 4 * constants.ONE_GiB,
        max_gpus: 0,
        time_limit_seconds: 7200,
        display_order: 0,
        is_default: true,
        is_enabled: true,
    },
    {
        id: "preset-medium",
        label: "Medium",
        max_cpu_cores: 8,
        min_memory_limit: 16 * constants.ONE_GiB,
        max_gpus: 0,
        time_limit_seconds: 86400,
        display_order: 1,
        is_default: false,
        is_enabled: true,
    },
    {
        id: "preset-large",
        label: "Large",
        max_cpu_cores: 16,
        min_memory_limit: 64 * constants.ONE_GiB,
        max_gpus: 0,
        time_limit_seconds: 259200,
        display_order: 2,
        is_default: false,
        is_enabled: true,
    },
    {
        id: "preset-gpu",
        label: "GPU",
        max_cpu_cores: 8,
        min_memory_limit: 32 * constants.ONE_GiB,
        max_gpus: 1,
        time_limit_seconds: 43200,
        display_order: 3,
        is_default: false,
        is_enabled: true,
    },
];
