/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import constants from "../../../../constants";
import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

import {
    QUICK_LAUNCH_APP_INFO,
    getAppInfo,
} from "serviceFacades/quickLaunches";

import AppLaunch from "components/apps/launch";

export default function Launch() {
    const [appKey, setAppKey] = React.useState(APP_DESCRIPTION_QUERY_KEY);
    const [
        appDescriptionQueryEnabled,
        setAppDescriptionQueryEnabled,
    ] = React.useState(false);
    const [
        quickLaunchAppDescriptionQueryEnabled,
        setQuickLaunchAppDescriptionQueryEnabled,
    ] = React.useState(false);
    const [app, setApp] = React.useState(null);
    const [launchError, setLaunchError] = React.useState(null);

    const router = useRouter();
    const qId = router.qId;
    const { systemId, appId } = router.query;

    React.useEffect(() => {
        const hasIds = !!(systemId && appId);

        setAppDescriptionQueryEnabled(hasIds);

        if (qId) {
            setQuickLaunchAppDescriptionQueryEnabled(true);
            setAppDescriptionQueryEnabled(false);
            setAppKey([QUICK_LAUNCH_APP_INFO, { qId }]);
        } else if (hasIds) {
            setQuickLaunchAppDescriptionQueryEnabled(false);
            setAppKey([
                APP_DESCRIPTION_QUERY_KEY,
                {
                    systemId,
                    appId,
                },
            ]);
        }
    }, [systemId, appId, qId, setAppDescriptionQueryEnabled]);

    const { status: appStatus } = useQuery({
        queryKey: appKey,
        queryFn: getAppDescription,
        config: {
            enabled: appDescriptionQueryEnabled,
            onSuccess: setApp,
            onError: setLaunchError,
        },
    });

    const { status: qLuanchStatus } = useQuery({
        queryKey: appKey,
        queryFn: getAppInfo,
        config: {
            enabled: quickLaunchAppDescriptionQueryEnabled,
            onSuccess: setApp,
            onError: setLaunchError,
        },
    });

    const loading =
        appStatus === constants.LOADING || qLuanchStatus === constants.LOADING;

    return <AppLaunch app={app} launchError={launchError} loading={loading} />;
}

Launch.getInitialProps = async () => ({
    namespacesRequired: ["apps", "launch", "common", "util"],
});
