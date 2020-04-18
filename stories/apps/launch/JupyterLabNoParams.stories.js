import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import NoParamsApp from "./data/JupyterLabNoParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    submitAnalysis,
} from "./constants";

export const JupyterLabNoParams = () => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            submitAnalysis={submitAnalysis}
            app={NoParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
