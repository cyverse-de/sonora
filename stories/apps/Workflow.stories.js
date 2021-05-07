import React from "react";

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

export default { title: "Apps / Workflows" };
