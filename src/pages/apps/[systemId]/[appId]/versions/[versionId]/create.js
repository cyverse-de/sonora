/**
 * A page for displaying the App Editor for creating a new app version.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { serverSideTranslations, RequiredNamespaces } from "i18n";

import AppEditor from "components/apps/editor";
import ids from "components/apps/editor/ids";
import WorkflowEditor from "components/apps/workflows/Editor";
import WorkflowIds from "components/apps/workflows/ids";
import { signInErrorResponse } from "components/error/errorCode";

import { useUserProfile } from "contexts/userProfile";

import {
    APP_DETAILS_QUERY_KEY,
    APP_UI_QUERY_KEY,
    getAppDetails,
    getAppUI,
} from "serviceFacades/apps";

import { getPipelineUI, PIPELINE_UI_QUERY_KEY } from "serviceFacades/pipelines";

/**
 * Formats an item in an app parameter's `arguments` list as a copy,
 * suitable for saving in a new version, by removing its `id`,
 * as well as formatting any of its own `arguments` or `groups`.
 *
 * @param {Object} paramArg An item in an app parameter's `arguments` list.
 * @returns The argument item formatted as a copy.
 */
const appParamArgCopy = ({ id, ...paramArg }) => {
    paramArg.arguments = paramArg.arguments?.map(appParamArgCopy);
    paramArg.groups = paramArg.groups?.map(appParamArgCopy);

    return paramArg;
};

/**
 * Formats an app parameter as a copy, suitable for saving in a new version,
 * by removing its `id`, as well as formatting any of its `arguments`.
 *
 * @param {Object} param An app parameter.
 * @returns The app parameter formatted as a copy.
 */
const appParamCopy = ({ id, ...param }) => {
    param.arguments = param.arguments?.map(appParamArgCopy);

    return param;
};

/**
 * Formats an app parameter group as a copy, suitable for saving in a new version,
 * by removing its `id`, as well as formatting all of its `parameters`.
 *
 * @param {Object} group An app parameter group.
 * @returns The app parameter group formatted as a copy.
 */
const appGroupCopy = ({ id, ...group }) => {
    group.parameters = group.parameters?.map(appParamCopy);

    return group;
};

export default function AppVersionCreate() {
    const [appDescription, setAppDescription] = React.useState(null);
    const [workflowDescription, setWorkflowDescription] = React.useState(null);
    const [appDetails, setAppDetails] = React.useState(null);
    const [loadingError, setLoadingError] = React.useState(null);

    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId, versionId } = router.query;

    const isPublic = appDetails?.is_public;
    const isWorkflow = appDetails?.step_count > 1;

    const { isFetching: appInfoLoading } = useQuery({
        queryKey: [APP_DETAILS_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppDetails({ systemId, appId }),
        enabled: !!(userProfile?.id && systemId && appId),
        onSuccess: setAppDetails,
        onError: setLoadingError,
    });

    const { isFetching: appUILoading } = useQuery({
        queryKey: [APP_UI_QUERY_KEY, { systemId, appId, versionId }],
        queryFn: () => getAppUI({ systemId, appId, versionId }),
        enabled: !!(
            userProfile?.id &&
            systemId &&
            appId &&
            versionId &&
            appDetails &&
            !isWorkflow
        ),
        onSuccess: (appUI) => {
            const { version_id, ...appCopy } = appUI;
            appCopy.groups = appCopy.groups?.map(appGroupCopy);

            setAppDescription(appCopy);
        },
        onError: setLoadingError,
    });

    const { isFetching: workflowUILoading } = useQuery({
        queryKey: [PIPELINE_UI_QUERY_KEY, { appId, versionId }],
        queryFn: () => getPipelineUI({ appId, versionId }),
        enabled: !!(userProfile?.id && appId && versionId && isWorkflow),
        onSuccess: (workflowUI) => {
            const { version_id, ...workflowCopy } = workflowUI;
            setWorkflowDescription(workflowCopy);
        },
        onError: setLoadingError,
    });

    React.useEffect(() => {
        if (userProfile?.id) {
            setLoadingError(null);
        } else {
            setLoadingError(signInErrorResponse);
        }
    }, [userProfile]);

    const loading = appInfoLoading || appUILoading || workflowUILoading;

    if (isWorkflow) {
        return (
            <WorkflowEditor
                baseId={WorkflowIds.WORKFLOW_EDITOR_FORM}
                appDescription={workflowDescription}
                isPublic={isPublic}
                loading={loading}
                loadingError={loadingError}
            />
        );
    }

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={appDescription}
            isPublic={isPublic}
            loading={loading}
            loadingError={loadingError}
        />
    );
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "app_editor",
                "app_editor_help",
                "app_param_types",
                "data",
                "launch",
                "tools",
                "upload",
                "urlImport",
                "workflows",
                ...RequiredNamespaces,
            ])),
        },
    };
}
