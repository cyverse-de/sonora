import React from "react";

import { workflowDescription } from "./WorkflowMocks";

import { mockErrorResponse } from "../axiosMock";

import WorkflowEditor from "components/apps/workflows/Editor";
import ids from "components/apps/workflows/ids";
import NewPipelineDefaults from "components/apps/workflows/NewPipelineDefaults";

export const NewWorkflow = (props) => {
    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={NewPipelineDefaults}
        />
    );
};

export const SimplePipeline = (props) => {
    const { loading, "Loading Error": loadingError } = props;

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
