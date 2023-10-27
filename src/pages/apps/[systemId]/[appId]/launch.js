/**
 * A page for displaying the App Launch Wizard for an app's latest version,
 * or for a saved launch.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "react-query";

import { i18n, RequiredNamespaces, useTranslation } from "i18n";

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

export const APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY =
    RESOURCE_USAGE_QUERY_KEY + "AppLaunch";

function Launch({ showErrorAnnouncer }) {
    const { t } = useTranslation("common");
    const [config] = useConfig();
    const [userProfile] = useUserProfile();
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

    const { isFetching: appDescriptionLoading } = useQuery({
        queryKey: [APP_DESCRIPTION_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppDescription({ systemId, appId }),
        enabled: !!(systemId && appId && !launchId),
        onSuccess: (resp) => {
            const checks = resp?.limitChecks;
            if (checks?.canRun || !userProfile?.id) {
                setApp(resp);
            } else {
                const checkResults = resp?.limitChecks?.results[0];
                const additionalInfo = checkResults?.additionalInfo;

                setLaunchError(checkResults?.reasonCodes[0]);
                setViceQuota(additionalInfo?.maxJobs);
                setRunningJobs(additionalInfo?.runningJobs);
                setHasPendingRequest(additionalInfo?.pendingRequest);
            }
        },
        onError: setLaunchError,
    });

    const { isFetching: savedLaunchLoading } = useQuery({
        queryKey: [SAVED_LAUNCH_APP_INFO, { launchId }],
        queryFn: () => getAppInfo({ launchId }),
        enabled: !!launchId,
        onSuccess: setApp,
        onError: setLaunchError,
    });

    const { isFetching: fetchingUsageSummary } = useQuery({
        queryKey: [APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce && !!userProfile?.id,
        onSuccess: (respData) => {
            const usage = respData?.cpu_usage?.total || 0;
            const subscription = respData?.subscription;
            const quota = getUserQuota(
                globalConstants.CPU_HOURS_RESOURCE_NAME,
                subscription
            );
            setComputeLimitExceeded(usage >= quota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const loading =
        appDescriptionLoading || savedLaunchLoading || fetchingUsageSummary;

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

export async function getServerSideProps({ locale }) {
    const title = i18n.t("launch:launchAnalysis");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "data",
                "upload",
                "urlImport",
                // "apps" and "launch" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default withErrorAnnouncer(Launch);
