import callApi from "../../common/callApi";

export const VICE_ADMIN_QUERY_KEY = "fetchViceAdmin";
export const ASYNC_DATA_QUERY_KEY = "fetchAsyncData";

export const asyncData = (externalID) =>
    callApi({
        endpoint: `/api/admin/vice/async-data?external-id=${externalID}`,
        method: "GET",
    });

export const getTimeLimit = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/time-limit`,
        method: "GET",
    });

export const extendTimeLimit = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/time-limit`,
        method: "POST",
    });

export const externalID = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/external-id`,
        method: "GET",
    });

export const exit = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/exit`,
        method: "POST",
    });

export const saveAndExit = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/save-and-exit`,
        method: "POST",
    });

export const saveOutputFiles = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/save-output-files`,
        method: "POST",
    });

export const downloadInputFiles = ({ analysisID }) =>
    callApi({
        endpoint: `/api/admin/vice/analyses/${analysisID}/download-input-files`,
        method: "POST",
    });

export const getUserJobLimit = ({ username }) => {
    const existsPromise = userExists({ username });
    const jobLimitPromise = callApi({
        endpoint: `/api/admin/vice/concurrent-job-limits/${username}`,
        method: "GET",
    });

    return existsPromise.then((doesExist) => {
        if (!doesExist) {
            throw new Error(`User ${username} does not exist`);
        }
        return jobLimitPromise;
    });
};

export const setUserJobLimit = ({ username, newLimit }) => {
    const existsPromise = userExists({ username });
    const setJobLimitPromise = callApi({
        endpoint: `/api/admin/vice/concurrent-job-limits/${username}`,
        method: "PUT",
        body: {
            concurrent_jobs: parseInt(newLimit, 10),
        },
    });

    return existsPromise.then((doesExist) => {
        if (!doesExist) {
            throw new Error(`User ${username} does not exist`);
        }
        return setJobLimitPromise;
    });
};

export const userExists = ({ username }) => {
    return callApi({
        endpoint: `/api/workspaces?username=${username}`,
        method: "GET",
    }).then((data) => data.workspaces.length > 0);
};

const resources = () =>
    callApi({
        endpoint: "/api/admin/vice/resources",
        method: "GET",
    });

export default resources;
