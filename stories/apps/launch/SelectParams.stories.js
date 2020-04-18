import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import SelectParamsApp from "./data/SelectParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    submitAnalysis,
} from "./constants";

export const SelectParams = () => {
    initMockAxiosFileFolderSelector();

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            submitAnalysis={submitAnalysis}
            app={SelectParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
