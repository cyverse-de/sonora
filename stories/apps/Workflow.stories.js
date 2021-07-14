import React from "react";

import {
    concatTasksMock,
    deprecatedConcatTasksMock,
    deprecatedToolsWorkflowDescription,
    deprecatedWordCountTasksMock,
    wordCountTasksMock,
    workflowDescription,
} from "./WorkflowMocks";

import { mockAxios, mockErrorResponse, errorResponseJSON } from "../axiosMock";
import { appsSearchResp } from "../search/searchMocks";

import WorkflowEditor from "components/apps/workflows/Editor";
import ids from "components/apps/workflows/ids";
import NewWorkflowDefaults from "components/apps/workflows/NewWorkflowDefaults";

const booleanControl = {
    control: {
        type: "boolean",
    },
};

const initAxiosMocks = () => {
    mockAxios.reset();

    mockAxios.onGet(/\/api\/apps\/.*\/tasks/).replyOnce(500, errorResponseJSON);

    mockAxios
        .onGet("/api/apps/de/67d15627-22c5-42bd-8daf-9af5deecceab/tasks")
        .reply((config) => {
            console.log("GET Word Count Tasks", config.url);
            return [200, wordCountTasksMock];
        });
    mockAxios
        .onGet("/api/apps/de/77830f32-084a-11e8-a871-008cfa5ae621/tasks")
        .reply((config) => {
            console.log("GET Concatenate Tasks", config.url);
            return [200, concatTasksMock];
        });
    mockAxios
        .onGet("/api/apps/de/c7f05682-23c8-4182-b9a2-e09650a5f49b/tasks")
        .reply((config) => {
            console.log("GET Deprecated Word Count Tasks", config.url);
            return [200, deprecatedWordCountTasksMock];
        });
    mockAxios
        .onGet("/api/apps/de/af334df2-ad6e-4bf4-b7e8-5686525b63b0/tasks")
        .reply((config) => {
            console.log("GET Deprecated Concatenate Tasks", config.url);
            return [200, deprecatedConcatTasksMock];
        });

    mockAxios.onGet(/\/api\/apps\?.*/).reply(200, appsSearchResp);

    // Since the save request does not include the list of tasks,
    // which are returned by the pipelines/:id/ui endpoint,
    // just return any mock workflow on success.
    mockAxios.onPost(/\/api\/apps\/pipelines/).reply((config) => {
        const pipeline = JSON.parse(config.data);
        console.log("Save New Workflow", config.url, pipeline);

        return [200, workflowDescription];
    });

    mockAxios.onPut(/\/api\/apps\/pipelines\/.*/).reply((config) => {
        const pipeline = JSON.parse(config.data);
        console.log("Update Workflow", config.url, pipeline);

        return [200, workflowDescription];
    });
};

export const NewWorkflow = (props) => {
    initAxiosMocks();

    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={NewWorkflowDefaults}
        />
    );
};

export const SimplePipeline = (props) => {
    const { loading, "Loading Error": loadingError } = props;

    initAxiosMocks();

    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={!(loading || loadingError) && workflowDescription}
            loading={loading}
            loadingError={loadingError && mockErrorResponse}
        />
    );
};

SimplePipeline.argTypes = {
    loading: booleanControl,
    "Loading Error": booleanControl,
};

export const DeprecatedToolsPipeline = (props) => {
    const { loading } = props;

    initAxiosMocks();

    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={!loading && deprecatedToolsWorkflowDescription}
            loading={loading}
        />
    );
};

DeprecatedToolsPipeline.argTypes = { loading: booleanControl };

export default { title: "Apps / Workflows" };
