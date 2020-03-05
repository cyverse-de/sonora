import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import NoParamsApp from "./data/JupyterLabNoParamsApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const JupyterLabNoParams = () => {
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
