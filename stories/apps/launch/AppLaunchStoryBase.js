import React from "react";

import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    saveQuickLaunch,
    submitAnalysis,
} from "./constants";

export default (props) => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            saveQuickLaunch={saveQuickLaunch}
            submitAnalysis={submitAnalysis}
            {...props}
        />
    );
};
