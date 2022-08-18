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

function addPipelineVersion({ appId, workflow }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}/versions`,
        method: "POST",
        body: workflow,
    });
}

function updatePipeline({ appId, versionId, workflow }) {
    return callApi({
        endpoint: `/api/apps/pipelines/${appId}/versions/${versionId}`,
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

function getPipelineUI({ appId, versionId }) {
    return versionId
        ? callApi({
              endpoint: `/api/apps/pipelines/${appId}/versions/${versionId}/ui`,
              method: "GET",
          })
        : callApi({
              endpoint: `/api/apps/pipelines/${appId}/ui`,
              method: "GET",
          });
}

export {
    addPipeline,
    addPipelineVersion,
    copyPipeline,
    getPipelineUI,
    updatePipeline,
    PIPELINE_UI_QUERY_KEY,
};
