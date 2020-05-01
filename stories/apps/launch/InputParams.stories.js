import React from "react";

import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import InputParamsApp from "./data/InputParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    saveQuickLaunch,
    submitAnalysis,
} from "./constants";

export const InputParams = () => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            saveQuickLaunch={saveQuickLaunch}
            submitAnalysis={submitAnalysis}
            app={InputParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
