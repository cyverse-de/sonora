import React from "react";
import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import DeprecatedParamsApp from "./data/DeprecatedParamsApp";

import {
    ANALYSIS_OUTPUT_DIR,
    STARTING_PATH,
    initMockAxiosFileFolderSelector,
    saveQuickLaunch,
    submitAnalysis,
} from "./constants";

import { withKnobs, boolean } from "@storybook/addon-knobs";

export const DeprecatedParams = () => {
    initMockAxiosFileFolderSelector();

    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);

    const app = { ...DeprecatedParamsApp, deleted, disabled };

    return (
        <AppLaunchWizard
            notify={false}
            defaultOutputDir={ANALYSIS_OUTPUT_DIR}
            startingPath={STARTING_PATH}
            saveQuickLaunch={saveQuickLaunch}
            submitAnalysis={submitAnalysis}
            app={app}
        />
    );
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
