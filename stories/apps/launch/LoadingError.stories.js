import React from "react";

import { withKnobs, boolean } from "@storybook/addon-knobs";

import AppLaunchStoryBase from "./AppLaunchStoryBase";

const errorObject = {
    response: {
        status: 404,
        data: {
            error_code: "ERR_NOT_FOUND",
            reason: "Something went awry",
        },
    },
};

export const LoadingError = () => {
    const customMessage = boolean("Longer Error Message", false);

    return (
        <AppLaunchStoryBase
            appError={{
                ...errorObject,
                message:
                    customMessage &&
                    "Something has gone awry with your request," +
                        " but here's a very long error message" +
                        " that could be displayed in this space!",
            }}
        />
    );
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
