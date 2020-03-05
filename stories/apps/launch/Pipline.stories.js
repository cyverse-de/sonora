import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import PipelineApp from "./data/PipelineApp";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const Pipline = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={PipelineApp}
        />
    );
};

export default { title: "Apps / Launch" };
