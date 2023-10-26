/**
 * A page for displaying the Workflow Editor for creating a new workflow.
 *
 * @author psarando
 */
import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";

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

export async function getServerSideProps({ locale }) {
    const title = i18n.t("apps:createWorkflow");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "launch",
                "workflows",
                ...RequiredNamespaces,
            ])),
        },
    };
}
