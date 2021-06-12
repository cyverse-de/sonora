import React from "react";

import {
    concatTasksMock,
    wordCountTasksMock,
    workflowDescription,
} from "./WorkflowMocks";

import { mockAxios, mockErrorResponse, errorResponseJSON } from "../axiosMock";
import { appsSearchResp } from "../search/searchMocks";

import WorkflowEditor from "components/apps/workflows/Editor";
import ids from "components/apps/workflows/ids";
import NewPipelineDefaults from "components/apps/workflows/NewPipelineDefaults";

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

    mockAxios.onGet(/\/api\/apps\?.*/).reply(200, appsSearchResp);
};

export const NewWorkflow = (props) => {
    initAxiosMocks();

    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={NewPipelineDefaults}
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

const booleanControl = {
    control: {
        type: "boolean",
    },
};

SimplePipeline.argTypes = {
    loading: booleanControl,
    "Loading Error": booleanControl,
};

export default { title: "Apps / Workflows" };
