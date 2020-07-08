/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 * Also handles calling analysis submission and quick-launch-save endpoints.
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import constants from "../../../../constants";

import NavigationConstants from "../../../../common/NavigationConstants";

import { useConfig } from "../../../../contexts/config";
import { useUserProfile } from "../../../../contexts/userProfile";

import { submitAnalysis } from "../../../../serviceFacades/analyses";
import { addQuickLaunch } from "../../../../serviceFacades/quickLaunches";
import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "../../../../serviceFacades/apps";

import AppLaunchWizard from "../../../../components/apps/launch/AppLaunchWizard";

export default () => {
    const [appKey, setAppKey] = React.useState(APP_DESCRIPTION_QUERY_KEY);
    const [
        appDescriptionQueryEnabled,
        setAppDescriptionQueryEnabled,
    ] = React.useState(false);
    const [app, setApp] = React.useState(null);
    const [appError, setAppError] = React.useState(null);

    const [config] = useConfig();
    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId } = router.query;

    React.useEffect(() => {
        if (systemId && appId) {
            setAppKey([
                APP_DESCRIPTION_QUERY_KEY,
                {
                    systemId,
                    appId,
                },
            ]);
            setAppDescriptionQueryEnabled(true);
        } else {
            setAppDescriptionQueryEnabled(false);
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

    const [submitAnalysisMutation] = useMutation(
        ({ submission }) => submitAnalysis(submission),
        {
            onSuccess: (resp, { onSuccess }) => {
                router.push(`/${NavigationConstants.ANALYSES}`);
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setAppError(error);
            },
        }
    );

    const [addQuickLaunchMutation] = useMutation(
        ({ quickLaunch }) => addQuickLaunch(quickLaunch),
        {
            onSuccess: (resp, { onSuccess }) => {
                // TODO route to app details or QL listing page?
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setAppError(error);
            },
        }
    );

    const loading = appStatus === constants.LOADING;

    // FIXME: notify, defaultOutputDir, and startingPath
    // need to come from user prefs.
    const notify = false;
    const irodsHomePath = config?.irods?.home_path;
    const username = userProfile?.id;

    const homePath =
        irodsHomePath && username ? `${irodsHomePath}/${username}` : "";
    const startingPath = homePath || "";
    const defaultOutputDir = homePath ? `${homePath}/analyses` : "";

    const defaultMaxCPUCores = config?.tools?.private.max_cpu_limit;
    const defaultMaxMemory = config?.tools?.private.max_memory_limit;
    const defaultMaxDiskSpace = config?.tools?.private.max_disk_limit;

    return (
        <AppLaunchWizard
            baseId="apps"
            notify={notify}
            defaultOutputDir={defaultOutputDir}
            startingPath={startingPath}
            defaultMaxCPUCores={defaultMaxCPUCores}
            defaultMaxMemory={defaultMaxMemory}
            defaultMaxDiskSpace={defaultMaxDiskSpace}
            app={app}
            appError={appError}
            loading={loading}
            submitAnalysis={(submission, onSuccess, onError) => {
                setAppError(null);
                submitAnalysisMutation({ submission, onSuccess, onError });
            }}
            saveQuickLaunch={(quickLaunch, onSuccess, onError) => {
                setAppError(null);
                addQuickLaunchMutation({ quickLaunch, onSuccess, onError });
            }}
        />
    );
};
