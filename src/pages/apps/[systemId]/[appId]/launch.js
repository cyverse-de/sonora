/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 * Also handles calling analysis submission and quick-launch-save endpoints.
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import constants from "../../../../constants";

import NavigationConstants from "../../../../common/NavigationConstants";

import { useConfig } from "../../../../contexts/config";
import { useUserProfile } from "../../../../contexts/userProfile";

import { submitAnalysis } from "../../../../serviceFacades/analyses";
import { getAppDescription } from "../../../../serviceFacades/apps";

import AppLaunchWizard from "../../../../components/apps/launch/AppLaunchWizard";

export default () => {
    const [appKey, setAppKey] = React.useState(null);
    const [app, setApp] = React.useState(null);
    const [appError, setAppError] = React.useState(null);

    const [config] = useConfig();
    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId } = router.query;

    React.useEffect(() => {
        if (systemId && appId) {
            setAppKey([
                "getAppDescription",
                {
                    systemId,
                    appId,
                },
            ]);
        }
    }, [systemId, appId]);

    const { status: appStatus } = useQuery({
        queryKey: appKey,
        queryFn: getAppDescription,
        config: {
            onSuccess: setApp,
            onError: setAppError,
        },
    });

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

    return (
        <AppLaunchWizard
            baseId="apps"
            notify={notify}
            defaultOutputDir={defaultOutputDir}
            startingPath={startingPath}
            app={app}
            appError={appError}
            loading={loading}
            submitAnalysis={(submission, onSuccess, onError) => {
                setAppError(null);

                submitAnalysis(submission)
                    .then((resp) => {
                        onSuccess(resp);
                        router.push(`/${NavigationConstants.ANALYSES}`);
                    })
                    .catch((error) => {
                        onError(error);
                        setAppError(error);
                    });
            }}
            saveQuickLaunch={(submission, onSuccess, onError) => {
                // TODO
                const errMsg = "Not yet implemented.";
                onError(errMsg);
                setAppError({ message: errMsg });
            }}
        />
    );
};
