import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import WordCountApp from "./data/WordCountApp";

import { ONE_GB, ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const DEWordCount = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={WordCountApp}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * ONE_GB}
            defaultMaxDiskSpace={64 * ONE_GB}
        />
    );
};

export default { title: "Apps / Launch" };
