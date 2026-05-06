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

export const VICE_OPERATORS_QUERY_KEY = "fetchViceOperators";

// Translate the snake_case operator payload from terrain into the camelCase
// shape the React components expect.
const fromTerrain = (op) => ({
    id: op.id,
    name: op.name,
    url: op.url,
    priority: op.priority,
    skipTlsVerify: op.tls_skip_verify,
});

// Translate a camelCase draft from the editor back to the snake_case shape
// terrain accepts.
const toTerrain = ({ name, url, priority, skipTlsVerify }) => ({
    name,
    url,
    priority,
    tls_skip_verify: skipTlsVerify,
});

export const getOperators = () =>
    callApi({
        endpoint: "/api/admin/vice/operators",
        method: "GET",
    }).then((data) => (data ?? []).map(fromTerrain));

export const createOperator = (body) =>
    callApi({
        endpoint: "/api/admin/vice/operators",
        method: "POST",
        body: toTerrain(body),
    }).then(fromTerrain);

// Terrain exposes the per-operator endpoint at /operators/id/:id (UUID).
export const updateOperator = ({ id, ...body }) =>
    callApi({
        endpoint: `/api/admin/vice/operators/id/${id}`,
        method: "PATCH",
        body: toTerrain(body),
    }).then(fromTerrain);

const resources = () =>
    callApi({
        endpoint: "/api/admin/vice/resources",
        method: "GET",
    });

export default resources;
