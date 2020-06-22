import React from "react";

import constants from "../../../src/constants";

import { saveQuickLaunch, submitAnalysis } from "./constants";

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
    const [appError, setAppError] = React.useState(null);

    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);
    const loading = boolean("Loading mask", false);
    const loadingError = boolean("Loading error", false);
    const submissionError = boolean("Submission error", false);

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

export default { title: "Apps / Launch", decorators: [withKnobs] };
