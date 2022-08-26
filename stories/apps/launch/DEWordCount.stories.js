import React from "react";

import constants from "../../../src/constants";

import { createSavedLaunch, submitAnalysis } from "./constants";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import WordCountApp from "./data/WordCountApp";

const errorObject = {
    response: {
        status: 404,
        data: {
            error_code: "ERR_NOT_FOUND",
            reason: "Something has gone awry",
        },
    },
};

export const DEWordCount = ({
    deleted,
    disabled,
    computeLimitExceeded,
    loading,
    loadingError,
    submissionError,
    defaultMaxCPUCores,
    defaultMaxMemory,
    defaultMaxDiskSpace,
}) => {
    const [appError, setAppError] = React.useState(null);

    const submissionOnSuccess = (onSuccess, onError) => (resp) => {
        if (submissionError) {
            onError("Something went horribly wrong...");
            setAppError({
                ...errorObject,
                message: "Something went horribly wrong...",
            });
        } else {
            onSuccess(resp);
        }
    };

    const submissionOnError = (onError) => (errMsg) => {
        onError(errMsg);
        setAppError({ ...errorObject, message: errMsg });
    };

    const app = { ...WordCountApp, deleted, disabled };

    if (deleted) {
        app.version = "deleted version";
        app.version_id = "deleted-version-id";
    }

    return (
        <AppLaunchStoryBase
            app={!loadingError && app}
            loading={loading}
            appError={appError || (loadingError && errorObject)}
            defaultMaxCPUCores={defaultMaxCPUCores}
            defaultMaxMemory={defaultMaxMemory}
            defaultMaxDiskSpace={defaultMaxDiskSpace}
            computeLimitExceeded={computeLimitExceeded}
            submitAnalysis={(submission, onSuccess, onError) => {
                setAppError(null);
                submitAnalysis(
                    submission,
                    submissionOnSuccess(onSuccess, onError),
                    submissionOnError(onError)
                );
            }}
            saveSavedLaunch={(submission, onSuccess, onError) => {
                setAppError(null);
                createSavedLaunch(
                    submission,
                    submissionOnSuccess(onSuccess, onError),
                    submissionOnError(onError)
                );
            }}
        />
    );
};

DEWordCount.argTypes = {
    deleted: {
        name: "Deleted",
        control: {
            type: "boolean",
        },
    },
    disabled: {
        name: "Disabled",
        control: {
            type: "boolean",
        },
    },
    computeLimitExceeded: {
        name: "Compute Limit Exceeded",
        control: {
            type: "boolean",
        },
    },
    loading: {
        name: "Loading Mask",
        control: {
            type: "boolean",
        },
    },
    loadingError: {
        name: "Loading Error",
        control: {
            type: "boolean",
        },
    },
    submissionError: {
        name: "Submission Error",
        control: {
            type: "boolean",
        },
    },
    defaultMaxCPUCores: {
        name: "Max CPU Cores",
        control: {
            type: "number",
        },
    },
    defaultMaxMemory: {
        name: "Max Memory",
        control: {
            type: "number",
        },
    },
    defaultMaxDiskSpace: {
        name: "Max Disk Space",
        control: {
            type: "number",
        },
    },
};

DEWordCount.args = {
    deleted: false,
    disabled: false,
    computeLimitExceeded: false,
    loading: false,
    loadingError: false,
    submissionError: false,
    defaultMaxCPUCores: 8,
    defaultMaxMemory: 4 * constants.ONE_GiB,
    defaultMaxDiskSpace: 64 * constants.ONE_GiB,
};
