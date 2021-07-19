/**
 * A page for displaying the Workflow Editor for creating a new workflow.
 *
 * @author psarando
 */
import React from "react";

import WorkflowEditor from "components/apps/workflows/Editor";
import NewWorkflowDefaults from "components/apps/workflows/NewWorkflowDefaults";
import ids from "components/apps/workflows/ids";

import { signInErrorResponse } from "components/error/errorCode";

import { useUserProfile } from "contexts/userProfile";

export default function AppCreate() {
    const [userProfile] = useUserProfile();
    const [loadingError, setLoadingError] = React.useState(null);

    React.useEffect(() => {
        if (userProfile?.id) {
            setLoadingError(null);
        } else {
            setLoadingError(signInErrorResponse);
        }
    }, [userProfile]);

    return (
        <WorkflowEditor
            baseId={ids.WORKFLOW_EDITOR_FORM}
            appDescription={NewWorkflowDefaults}
            loadingError={loadingError}
        />
    );
}

AppCreate.getInitialProps = async () => ({
    namespacesRequired: ["apps", "common", "search", "workflows"],
});
