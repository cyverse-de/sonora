/**
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import constants from "../../../../constants";
import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

import {
    SAVED_LAUNCH_APP_INFO,
    getAppInfo,
} from "serviceFacades/savedLaunches";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";
import { useConfig } from "contexts/config";

import { getUserQuota } from "../../../../common/resourceUsage";
import globalConstants from "../../../../constants";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

function Launch({ showErrorAnnouncer }) {
    const { t } = useTranslation("dashboard");
    const [config] = useConfig();
    const [userProfile] = useUserProfile();
    const [appKey, setAppKey] = React.useState(APP_DESCRIPTION_QUERY_KEY);
    const [appDescriptionQueryEnabled, setAppDescriptionQueryEnabled] =
        React.useState(false);
    const [
        savedLaunchAppDescriptionQueryEnabled,
        setSavedLaunchAppDescriptionQueryEnabled,
    ] = React.useState(false);
    const [app, setApp] = React.useState(null);
    const [launchError, setLaunchError] = React.useState(null);
    const [viceQuota, setViceQuota] = React.useState();
    const [runningJobs, setRunningJobs] = React.useState();
    const [hasPendingRequest, setHasPendingRequest] = React.useState();
    const [computeLimitExceeded, setComputeLimitExceeded] = React.useState(
        !!config?.subscriptions?.enforce
    );

    const router = useRouter();
    const { systemId, appId } = router.query;
    const launchId =
        router.query["saved-launch-id"] || router.query["quick-launch-id"];

    React.useEffect(() => {
        const hasIds = !!(systemId && appId);

        setAppDescriptionQueryEnabled(hasIds);

        if (launchId) {
            setSavedLaunchAppDescriptionQueryEnabled(true);
            setAppDescriptionQueryEnabled(false);
            setAppKey([SAVED_LAUNCH_APP_INFO, { launchId }]);
        } else if (hasIds) {
            setSavedLaunchAppDescriptionQueryEnabled(false);
            setAppDescriptionQueryEnabled(true);
            setAppKey([
                APP_DESCRIPTION_QUERY_KEY,
                {
                    systemId,
                    appId,
                },
            ]);
        }
    }, [systemId, appId, launchId, setAppDescriptionQueryEnabled]);

    const { status: appStatus } = useQuery({
        queryKey: appKey,
        queryFn: () => getAppDescription(appKey[1]),
        enabled: appDescriptionQueryEnabled,
        onSuccess: (resp) => {
            if (resp?.limitChecks?.canRun || !userProfile?.id) {
                setApp(resp);
            } else {
                setLaunchError(resp?.limitChecks?.results[0]?.reasonCodes[0]);
                setViceQuota(
                    resp?.limitChecks?.results[0]?.additionalInfo?.maxJobs
                );
                setRunningJobs(
                    resp?.limitChecks?.results[0]?.additionalInfo?.runningJobs
                );
                setHasPendingRequest(
                    resp?.limitChecks?.results[0]?.additionalInfo
                        ?.pendingRequest
                );
            }
        },
        onError: setLaunchError,
    });

    const { status: savedLaunchStatus } = useQuery({
        queryKey: appKey,
        queryFn: () => getAppInfo(appKey[1]),
        enabled: savedLaunchAppDescriptionQueryEnabled,
        onSuccess: setApp,
        onError: setLaunchError,
    });

    const { isFetching: fetchingUsageSummary } = useQuery({
        queryKey: [RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce,
        onSuccess: (respData) => {
            const usage = respData?.cpu_usage?.total || 0;
            const userPlan = respData?.user_plan;
            const quota = getUserQuota(
                globalConstants.CPU_HOURS_RESOURCE_NAME,
                userPlan
            );
            setComputeLimitExceeded(usage >= quota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const loading =
        appStatus === constants.LOADING ||
        savedLaunchStatus === constants.LOADING ||
        fetchingUsageSummary;

    return (
        <AppLaunch
            app={app}
            launchError={launchError}
            loading={loading}
            viceQuota={viceQuota}
            runningJobs={runningJobs}
            pendingRequest={hasPendingRequest}
            computeLimitExceeded={computeLimitExceeded}
        />
    );
}

export default withErrorAnnouncer(Launch);

Launch.getInitialProps = async () => ({
    namespacesRequired: ["apps", "launch", "common", "util"],
});
