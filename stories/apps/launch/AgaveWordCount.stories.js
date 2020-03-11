import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import AgaveWordCountApp from "./data/AgaveWordCount";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const AgaveWordCount = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={AgaveWordCountApp}
        />
    );
};

export default { title: "Apps / Launch" };
