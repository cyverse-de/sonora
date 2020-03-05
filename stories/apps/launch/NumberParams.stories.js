import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import NumberParamsApp from "./data/NumberParamsApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

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

export default { title: "Apps / Launch" };
