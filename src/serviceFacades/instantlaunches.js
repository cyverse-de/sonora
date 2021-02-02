import callApi from "../common/callApi";

export const DEFAULTS_MAPPING_QUERY_KEY = "fetchDefaultsMappings";

export const getDefaultsMapping = () =>
    callApi({
        endpoint: `/api/instantlaunches/mappings/defaults/latest`,
        method: "GET",
    });
