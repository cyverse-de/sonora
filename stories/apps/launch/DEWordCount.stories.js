import React from "react";

import constants from "../../../src/constants";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import WordCountApp from "./data/WordCountApp";

import { withKnobs, boolean } from "@storybook/addon-knobs";

export const DEWordCount = () => {
    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);

    const app = { ...WordCountApp, deleted, disabled };

    return (
        <AppLaunchStoryBase
            app={app}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * constants.ONE_GiB}
            defaultMaxDiskSpace={64 * constants.ONE_GiB}
        />
    );
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
