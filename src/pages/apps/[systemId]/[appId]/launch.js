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
} from "../../../../serviceFacades/apps";

import AppLaunch from "../../../../components/apps/launch";

export default () => {
    const [appKey, setAppKey] = React.useState(APP_DESCRIPTION_QUERY_KEY);
    const [
        appDescriptionQueryEnabled,
        setAppDescriptionQueryEnabled,
    ] = React.useState(false);
    const [app, setApp] = React.useState(null);
    const [appError, setAppError] = React.useState(null);

    const router = useRouter();
    const { systemId, appId } = router.query;

    React.useEffect(() => {
        const hasIds = !!(systemId && appId);

        setAppDescriptionQueryEnabled(hasIds);

        if (hasIds) {
            setAppKey([
                APP_DESCRIPTION_QUERY_KEY,
                {
                    systemId,
                    appId,
                },
            ]);
        }
    }, [systemId, appId, setAppDescriptionQueryEnabled]);

    const { status: appStatus } = useQuery({
        queryKey: appKey,
        queryFn: getAppDescription,
        config: {
            enabled: appDescriptionQueryEnabled,
            onSuccess: setApp,
            onError: setAppError,
        },
    });

    const loading = appStatus === constants.LOADING;

    return <AppLaunch app={app} appError={appError} loading={loading} />;
};
