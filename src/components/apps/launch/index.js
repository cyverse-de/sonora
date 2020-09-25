/**
 * @author psarando
 *
 * A component for displaying the App Launch Wizard for a given app.
 * Also handles calling analysis submission and quick-launch-save endpoints.
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation, queryCache } from "react-query";
import { BOOTSTRAP_KEY } from "serviceFacades/users";

import NavigationConstants from "common/NavigationConstants";

import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import { usePreferences } from "contexts/userPreferences";

import { submitAnalysis } from "serviceFacades/analyses";
import { addQuickLaunch } from "serviceFacades/quickLaunches";

import AppLaunchWizard from "./AppLaunchWizard";

export default ({ app, launchError, loading }) => {
    const [submissionError, setSubmissionError] = React.useState(null);
    const [preferences] = usePreferences();
    const [config] = useConfig();
    const [userProfile] = useUserProfile();

    const router = useRouter();

    const [submitAnalysisMutation] = useMutation(
        ({ submission }) => submitAnalysis(submission),
        {
            onSuccess: (resp, { onSuccess }) => {
                router.push(`/${NavigationConstants.ANALYSES}`);
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setSubmissionError(error);
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
                setSubmissionError(error);
            },
        }
    );

    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);
    const userHomeFromBootStrap = bootstrapCache?.data_info?.user_home_path;
    const irodsHomePath = config?.irods?.home_path;
    const username = userProfile?.id;
    const homePath =
        userHomeFromBootStrap || (irodsHomePath && username)
            ? `${irodsHomePath}/${username}`
            : "";

    const startingPath = preferences?.lastFolder || homePath || "";
    const defaultOutputDir =
        preferences?.default_output_folder?.path ||
        preferences?.system_default_output_dir?.path ||
        (homePath && `${homePath}/analyses`) ||
        "";

    const notify = preferences?.enableAnalysisEmailNotification || false;

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
            appError={launchError || submissionError}
            loading={loading}
            submitAnalysis={(submission, onSuccess, onError) => {
                setSubmissionError(null);
                submitAnalysisMutation({ submission, onSuccess, onError });
            }}
            saveQuickLaunch={(quickLaunch, onSuccess, onError) => {
                setSubmissionError(null);
                addQuickLaunchMutation({ quickLaunch, onSuccess, onError });
            }}
        />
    );
};
