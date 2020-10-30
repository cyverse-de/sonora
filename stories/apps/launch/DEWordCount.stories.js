import React from "react";

import constants from "../../../src/constants";

import { saveQuickLaunch, submitAnalysis } from "./constants";

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
    loading,
    loadingError,
    submissionError,
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

    return (
        <AppLaunchStoryBase
            app={!loadingError && app}
            loading={loading}
            appError={appError || (loadingError && errorObject)}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * constants.ONE_GiB}
            defaultMaxDiskSpace={64 * constants.ONE_GiB}
            submitAnalysis={(submission, onSuccess, onError) => {
                setAppError(null);
                submitAnalysis(
                    submission,
                    submissionOnSuccess(onSuccess, onError),
                    submissionOnError(onError)
                );
            }}
            saveQuickLaunch={(submission, onSuccess, onError) => {
                setAppError(null);
                saveQuickLaunch(
                    submission,
                    submissionOnSuccess(onSuccess, onError),
                    submissionOnError(onError)
                );
            }}
        />
    );
};

export default {
    title: "Apps / Launch",
    component: AppLaunchStoryBase,
    argTypes: {
        deleted: {
            control: {
                type: "boolean",
            },
        },
        disabled: {
            control: {
                type: "boolean",
            },
        },
        loading: {
            control: {
                type: "boolean",
            },
        },
        loadingError: {
            control: {
                type: "boolean",
            },
        },
        submissionError: {
            control: {
                type: "boolean",
            },
        },
    },
};
