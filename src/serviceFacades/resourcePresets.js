import callApi from "../common/callApi";

const RESOURCE_PRESETS_QUERY_KEY = "fetchResourcePresets";
const RESOURCE_PRESETS_LISTING_QUERY_KEY = "fetchResourcePresetsListing";

function getResourcePresets() {
    return callApi({
        endpoint: "/api/resource-presets",
        method: "GET",
    });
}

function listResourcePresets() {
    return callApi({
        endpoint: "/api/admin/resource-presets",
        method: "GET",
    });
}

function createResourcePreset(body) {
    return callApi({
        endpoint: "/api/admin/resource-presets",
        method: "POST",
        body,
    });
}

function updateResourcePreset({ id, ...body }) {
    return callApi({
        endpoint: `/api/admin/resource-presets/${id}`,
        method: "PATCH",
        body,
    });
}

function deleteResourcePreset({ id }) {
    return callApi({
        endpoint: `/api/admin/resource-presets/${id}`,
        method: "DELETE",
    });
}

function setDefaultResourcePreset({ id }) {
    return callApi({
        endpoint: `/api/admin/resource-presets/${id}/default`,
        method: "PUT",
    });
}

export {
    RESOURCE_PRESETS_QUERY_KEY,
    RESOURCE_PRESETS_LISTING_QUERY_KEY,
    getResourcePresets,
    listResourcePresets,
    createResourcePreset,
    updateResourcePreset,
    deleteResourcePreset,
    setDefaultResourcePreset,
};
