/**
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { serverSideTranslations, RequiredNamespaces } from "i18n";

import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

export default function Launch() {
    const [userProfile] = useUserProfile();
    const [app, setApp] = React.useState(null);
    const [launchError, setLaunchError] = React.useState(null);
    const [viceQuota, setViceQuota] = React.useState();
    const [runningJobs, setRunningJobs] = React.useState();
    const [hasPendingRequest, setHasPendingRequest] = React.useState();

    const router = useRouter();
    const { systemId, appId, versionId } = router.query;

    const { isFetching: loading } = useQuery({
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

    return (
        <AppLaunch
            app={app}
            launchError={launchError}
            loading={loading}
            viceQuota={viceQuota}
            runningJobs={runningJobs}
            pendingRequest={hasPendingRequest}
        />
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "apps",
                "launch",
                "util",
                ...RequiredNamespaces,
            ])),
        },
    };
}
