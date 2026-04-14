/**
 * A page for displaying the App Launch Wizard for an app's latest version,
 * or for a saved launch.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "@tanstack/react-query";

import { i18n, RequiredNamespaces } from "i18n";

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

import useResourceUsageSummary from "common/useResourceUsageSummary";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

function Launch({ showErrorAnnouncer }) {
    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId } = router.query;

    const { isFetchingUsageSummary, computeLimitExceeded } =
        useResourceUsageSummary(showErrorAnnouncer);

    const launchId =
        router.query["saved-launch-id"] || router.query["quick-launch-id"];

    const {
        data: app,
        isFetching: appDescriptionLoading,
        error: appDescriptionError,
    } = useQuery({
        queryKey: [APP_DESCRIPTION_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppDescription({ systemId, appId }),
        enabled: !!(systemId && appId && !launchId),
    });

    const canRun = app?.limitChecks?.canRun || !userProfile?.id;
    const limitCheck = !canRun && app?.limitChecks?.results[0];
    const limitCheckReason = limitCheck?.reasonCodes?.[0];
    const viceQuota = limitCheck?.additionalInfo?.maxJobs;
    const runningJobs = limitCheck?.additionalInfo?.runningJobs;
    const hasPendingRequest = limitCheck?.additionalInfo?.pendingRequest;

    const {
        data: savedLaunchAppInfo,
        isFetching: savedLaunchLoading,
        error: savedLaunchError,
    } = useQuery({
        queryKey: [SAVED_LAUNCH_APP_INFO, { launchId }],
        queryFn: () => getAppInfo({ launchId }),
        enabled: !!launchId,
    });

    const launchError =
        appDescriptionError || savedLaunchError || limitCheckReason;
    const loading =
        appDescriptionLoading || savedLaunchLoading || isFetchingUsageSummary;

    return (
        <AppLaunch
            app={app || savedLaunchAppInfo}
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
