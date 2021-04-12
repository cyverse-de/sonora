import callApi from "../common/callApi";

export const DEFAULTS_MAPPING_QUERY_KEY = "fetchDefaultsMappings";
export const ALL_INSTANT_LAUNCHES_KEY = "allInstantLaunches";
export const DASHBOARD_INSTANT_LAUNCHES_KEY = "dashboardInstantLaunches";

export const getDefaultsMapping = () =>
    callApi({
        endpoint: `/api/instantlaunches/mappings/defaults/latest`,
        method: "GET",
    });

export const updateDefaultsMapping = (newMapping) =>
    callApi({
        endpoint: "/api/instantlaunches/mappings/defaults/latest",
        method: "POST",
        body: newMapping,
    });

export const createDefaultsMapping = (newMapping) =>
    callApi({
        endpoint: "/api/instantlaunches/mappings/defaults/latest",
        method: "PUT",
        body: newMapping,
    });

export const addInstantLaunch = (id) => {
    const bodyObj = {
        quick_launch_id: id,
    };

    return callApi({
        endpoint: `/api/instantlaunches`,
        method: "PUT",
        body: bodyObj,
    });
};

export const listInstantLaunches = (id) =>
    callApi({
        endpoint: `/api/instantlaunches`,
        method: "GET",
    });

export const deleteInstantLaunch = (id) =>
    callApi({
        endpoint: `/api/instantlaunches/${id}`,
        method: "DELETE",
    });

export const listFullInstantLaunches = (id) =>
    callApi({
        endpoint: `/api/instantlaunches/full`,
        method: "GET",
    });

export const getInstantLaunchMetadata = (id) =>
    callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "GET",
    });

/**
 * Add or modify the AVUs associated with an instant launch.
 *
 * @param {string} id - The UUID fo the instant launch.
 * @param {Object} metadata - Contains the metadata for the instant launch.
 * @param {Object[]} metadata.avus - The list of AVUS. Each AVU should have an attr, value, and unit property.
 */
export const upsertInstantLaunchMetadata = (id, metadata) => {
    const bodyObj = {
        avus: [metadata],
    };
    return callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "POST",
        body: bodyObj,
    });
};

export const resetInstantLaunchMetadata = (id, avuList) => {
    const bodyObj = {
        avus: avuList,
    };
    return callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "PUT",
        body: bodyObj,
    });
};

export const listInstantLaunchesByMetadata = (key, queryKey, queryValue) =>
    callApi({
        endpoint: `/api/instantlaunches/metadata/full`,
        method: "GET",
        params: { attribute: queryKey, value: queryValue, unit: "" },
    });
