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

function getPipelineUI(_, { appId }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}/ui`,
        method: "GET",
    });
}

export { addPipeline, getPipelineUI, updatePipeline, PIPELINE_UI_QUERY_KEY };
