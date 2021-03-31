/**
 * A page for displaying the App Editor for an app with the given IDs.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import AppEditor from "components/apps/editor";
import ids from "components/apps/editor/ids";

import {
    getAppUI,
    getAppById,
    APP_UI_QUERY_KEY,
    APP_BY_ID_QUERY_KEY,
} from "serviceFacades/apps";

export default function AppEdit() {
    const [app, setApp] = React.useState(null);
    const [appListingInfo, setAppListingInfo] = React.useState(null);
    const [loadingError, setLoadingError] = React.useState(null);

    const router = useRouter();
    const { systemId, appId } = router.query;

    const { isFetching: appInfoLoading } = useQuery({
        queryKey: [APP_BY_ID_QUERY_KEY, { systemId, appId }],
        queryFn: getAppById,
        config: {
            enabled: systemId && appId,
            onSuccess: (result) => {
                setAppListingInfo(result?.apps[0]);
            },
            onError: setLoadingError,
        },
    });

    const { isFetching } = useQuery({
        queryKey: [APP_UI_QUERY_KEY, { systemId, appId }],
        queryFn: getAppUI,
        config: {
            enabled: systemId && appId,
            onSuccess: setApp,
            onError: setLoadingError,
        },
    });

    const loading = appInfoLoading || isFetching;
    const isPublic = appListingInfo?.is_public;

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

AppEdit.getInitialProps = async () => ({
    namespacesRequired: [
        "app_editor",
        "app_editor_help",
        "app_param_types",
        "common",
        "data",
        "launch",
    ],
});
