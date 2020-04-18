import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import TextParamsApp from "./data/TextParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    submitAnalysis,
} from "./constants";

export const TextParams = () => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            submitAnalysis={submitAnalysis}
            app={TextParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
