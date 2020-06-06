import React from "react";

import constants from "../../../src/constants";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import WordCountApp from "./data/WordCountApp";

import { withKnobs, boolean } from "@storybook/addon-knobs";

const errorObject = {
    response: {
        status: 404,
        data: {
            error_code: "ERR_NOT_FOUND",
            reason: "Something has gone awry",
        },
    },
};

export const DEWordCount = () => {
    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);
    const loading = boolean("Loading mask", false);
    const loadingError = boolean("Loading error", false);

    const app = { ...WordCountApp, deleted, disabled };

    return (
        <AppLaunchStoryBase
            app={!loadingError && app}
            loading={loading}
            appError={loadingError && errorObject}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * constants.ONE_GiB}
            defaultMaxDiskSpace={64 * constants.ONE_GiB}
        />
    );
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
