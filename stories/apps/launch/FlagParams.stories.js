import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import FlagParamsApp from "./data/FlagParamsApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const FlagParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={FlagParamsApp}
        />
    );
};

export default { title: "Apps / Launch" };
