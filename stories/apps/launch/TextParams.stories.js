import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import TextParamsApp from "./data/TextParamsApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const TextParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={TextParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
