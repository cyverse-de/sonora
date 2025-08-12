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

import { i18n, RequiredNamespaces } from "i18n";

import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

import { APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY } from "serviceFacades/dashboard";

import {
    SAVED_LAUNCH_APP_INFO,
    getAppInfo,
} from "serviceFacades/savedLaunches";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

import useResourceUsageSummary from "common/useResourceUsageSummary";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

function Launch({ showErrorAnnouncer }) {
    const [userProfile] = useUserProfile();
    const [app, setApp] = React.useState(null);
    const [launchError, setLaunchError] = React.useState(null);
    const [viceQuota, setViceQuota] = React.useState();
    const [runningJobs, setRunningJobs] = React.useState();
    const [hasPendingRequest, setHasPendingRequest] = React.useState();

    const router = useRouter();
    const { systemId, appId } = router.query;

    const { isFetchingUsageSummary, computeLimitExceeded } =
        useResourceUsageSummary(showErrorAnnouncer);

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

    const loading =
        appDescriptionLoading || savedLaunchLoading || isFetchingUsageSummary;

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
                "preferences",
                "urlImport",
                // "apps" and "launch" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default withErrorAnnouncer(Launch);
