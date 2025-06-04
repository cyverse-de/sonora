/**
 * A page for displaying the App Launch Wizard for an app with the given IDs.
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

import AppLaunch from "components/apps/launch";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { useUserProfile } from "contexts/userProfile";
import useResourceUsageSummary from "common/useResourceUsageSummary";

function Launch({ showErrorAnnouncer }) {
    const [userProfile] = useUserProfile();
    const [app, setApp] = React.useState(null);
    const [launchError, setLaunchError] = React.useState(null);
    const [viceQuota, setViceQuota] = React.useState();
    const [runningJobs, setRunningJobs] = React.useState();
    const [hasPendingRequest, setHasPendingRequest] = React.useState();

    const router = useRouter();
    const { systemId, appId, versionId } = router.query;

    const { isFetchingUsageSummary, computeLimitExceeded } =
        useResourceUsageSummary(
            showErrorAnnouncer,
            APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY
        );

    const { isFetching: appDescriptionLoading } = useQuery({
        queryKey: [
            APP_DESCRIPTION_QUERY_KEY,
            {
                systemId,
                appId,
                versionId,
            },
        ],
        queryFn: () =>
            getAppDescription({
                systemId,
                appId,
                versionId,
            }),
        enabled: !!(systemId && appId && versionId),
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

    const loading = appDescriptionLoading || isFetchingUsageSummary;

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
                "preferences",
                "upload",
                "urlImport",
                // "apps" and "launch" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default withErrorAnnouncer(Launch);
