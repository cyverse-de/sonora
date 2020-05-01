import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import FlagParamsApp from "./data/FlagParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    saveQuickLaunch,
    submitAnalysis,
} from "./constants";

export const FlagParams = () => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            saveQuickLaunch={saveQuickLaunch}
            submitAnalysis={submitAnalysis}
            app={FlagParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
