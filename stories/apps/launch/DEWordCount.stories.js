import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import WordCountApp from "./data/WordCountApp";

import { ONE_GB } from "./constants";

import { withKnobs, boolean } from "@storybook/addon-knobs";

export const DEWordCount = () => {
    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);

    const app = { ...WordCountApp, deleted, disabled };

    return (
        <AppLaunchStoryBase
            app={app}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * ONE_GB}
            defaultMaxDiskSpace={64 * ONE_GB}
        />
    );
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
