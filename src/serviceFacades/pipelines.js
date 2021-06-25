/**
 * @author psarando
 */
import callApi from "../common/callApi";

const PIPELINE_UI_QUERY_KEY = "fetchPipelineUI";

function addPipeline({ workflow }) {
    return callApi({
        endpoint: `/api/apps/pipelines`,
        method: "POST",
        body: workflow,
    });
}

function updatePipeline({ appId, workflow }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}`,
        method: "PUT",
        body: workflow,
    });
}

function copyPipeline({ appId }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}/copy`,
        method: "POST",
    });
}

function getPipelineUI(_, { appId }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}/ui`,
        method: "GET",
    });
}

export {
    addPipeline,
    copyPipeline,
    getPipelineUI,
    updatePipeline,
    PIPELINE_UI_QUERY_KEY,
};
