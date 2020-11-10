import React from "react";

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

export const LoadingError = ({ "Longer Error Message": customMessage }) => {
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

LoadingError.argTypes = {
    "Longer Error Message": {
        control: {
            type: "boolean",
        },
    },
};
