import React from "react";
import AppLaunchWizard from "../../src/components/apps/launch/AppLaunchWizard";

import WordCountApp from "./launch/data/WordCountApp";
import NumberParamsApp from "./launch/data/NumberParamsApp";
import PipelineApp from "./launch/data/PipelineApp";
import NoParamsApp from "./launch/data/NoParamsApp";

import { ONE_GB, ANALYSIS_OUTPUT_DIR } from "./launch/constants";

const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};

export const DEWordCount = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={WordCountApp}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * ONE_GB}
            defaultMaxDiskSpace={64 * ONE_GB}
        />
    );
};

export const NumberParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={NumberParamsApp}
        />
    );
};

export const Pipline = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={PipelineApp}
        />
    );
};

export const NoParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={NoParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
