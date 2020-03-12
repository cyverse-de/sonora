import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import OutputParamsApp from "./data/OutputParamsApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const OutputParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={OutputParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
