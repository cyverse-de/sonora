import callApi from "../common/callApi";

export const DEFAULTS_MAPPING_QUERY_KEY = "fetchDefaultsMappings";

export const getDefaultsMapping = () =>
    callApi({
        endpoint: `/api/instantlaunches/mappings/defaults/latest`,
        method: "GET",
    });

export const addInstantLaunch = (id) =>
    callApi({
        endpoint: `/api/instantlaunches`,
        method: "PUT",
    });

export const listInstantLaunches = (id) =>
    callApi({
        endpoint: `/api/instantlaunches`,
        method: "GET",
    });

export const getInstantLaunchMetadata = (id) =>
    callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "GET",
    });

export const upsertInstantLaunchMetadata = (id, metadata) =>
    callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "POST",
        body: metadata,
    });

export const resetInstantLaunchMetadata = (id, metadata) =>
    callApi({
        endpoint: `/api/instantlaunches/${id}/metadata`,
        method: "PUT",
        body: metadata,
    });
