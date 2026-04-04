/**
 * A page for displaying the App or Workflow Editor for an app or pipeline
 * with the given IDs.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "@tanstack/react-query";

import { i18n, RequiredNamespaces } from "i18n";

import AppEditor from "components/apps/editor";
import ids from "components/apps/editor/ids";
import WorkflowEditor from "components/apps/workflows/Editor";
import WorkflowIds from "components/apps/workflows/ids";
import { signInErrorResponse } from "components/error/errorCode";

import { useUserProfile } from "contexts/userProfile";

import {
    getAppUI,
    getAppById,
    APP_UI_QUERY_KEY,
    APP_BY_ID_QUERY_KEY,
} from "serviceFacades/apps";

import { getPipelineUI, PIPELINE_UI_QUERY_KEY } from "serviceFacades/pipelines";

export default function AppEdit() {
    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId, versionId } = router.query;

    const {
        data: appInfoResult,
        isFetching: appInfoLoading,
        error: appInfoError,
    } = useQuery({
        queryKey: [APP_BY_ID_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppById({ systemId, appId }),
        enabled: !!(userProfile?.id && systemId && appId),
    });

    const appListingInfo = appInfoResult?.apps[0];

    const isPublic = appListingInfo?.is_public;
    const isWorkflow = appListingInfo?.step_count > 1;

    const {
        data: app,
        isFetching: appUILoading,
        error: appUIError,
    } = useQuery({
        queryKey: [APP_UI_QUERY_KEY, { systemId, appId, versionId }],
        queryFn: () => getAppUI({ systemId, appId, versionId }),
        enabled: !!(
            userProfile?.id &&
            systemId &&
            appId &&
            versionId &&
            appListingInfo &&
            !isWorkflow
        ),
    });

    const {
        data: workflowDescription,
        isFetching: workflowUILoading,
        error: workflowUIError,
    } = useQuery({
        queryKey: [PIPELINE_UI_QUERY_KEY, { appId, versionId }],
        queryFn: () => getPipelineUI({ appId, versionId }),
        enabled: !!(userProfile?.id && appId && versionId && isWorkflow),
    });

    const loading = appInfoLoading || appUILoading || workflowUILoading;
    const loadingError =
        (!userProfile?.id && signInErrorResponse) ||
        appInfoError ||
        appUIError ||
        workflowUIError;

    if (isWorkflow) {
        return (
            <WorkflowEditor
                baseId={WorkflowIds.WORKFLOW_EDITOR_FORM}
                appDescription={workflowDescription}
                loading={loading}
                loadingError={loadingError}
            />
        );
    }

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={app}
            loading={loading}
            loadingError={loadingError}
            cosmeticOnly={isPublic}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("apps:editApp");

    return {
        props: {
            title,
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
