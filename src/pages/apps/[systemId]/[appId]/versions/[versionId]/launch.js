/**
 * A page for displaying the App Launch Wizard for an app with the given IDs.
 *
 * @author psarando
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { i18n } from "i18n";
import { commonServerSideProps } from "common/getServerSideProps";

import {
    getAppDescription,
    APP_DESCRIPTION_QUERY_KEY,
} from "serviceFacades/apps";

import AppLaunch from "components/apps/launch";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { useUserProfile } from "contexts/userProfile";
import useResourceUsageSummary from "common/useResourceUsageSummary";

function Launch({ showErrorAnnouncer }) {
    const [userProfile] = useUserProfile();

    const router = useRouter();
    const { systemId, appId, versionId } = router.query;

    const { isFetchingUsageSummary, computeLimitExceeded, gpuLimitExceeded } =
        useResourceUsageSummary(showErrorAnnouncer);

    const {
        isFetching: appDescriptionLoading,
        data: app,
        error: launchError,
    } = useQuery({
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
    });

    const canRun = app?.limitChecks?.canRun || !userProfile?.id;
    const limitCheck = !canRun && app?.limitChecks?.results[0];
    const limitCheckReason = limitCheck?.reasonCodes?.[0];
    const viceQuota = limitCheck?.additionalInfo?.maxJobs;
    const runningJobs = limitCheck?.additionalInfo?.runningJobs;
    const hasPendingRequest = limitCheck?.additionalInfo?.pendingRequest;

    const loading = appDescriptionLoading || isFetchingUsageSummary;

    return (
        <AppLaunch
            app={app}
            launchError={launchError || limitCheckReason}
            loading={loading}
            viceQuota={viceQuota}
            runningJobs={runningJobs}
            pendingRequest={hasPendingRequest}
            computeLimitExceeded={computeLimitExceeded}
            gpuLimitExceeded={gpuLimitExceeded}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("launch:launchAnalysis");

    return {
        props: {
            title,
            ...(await commonServerSideProps(locale, [
                "data",
                "preferences",
                "upload",
                "urlImport",
                // "apps" and "launch" already included by commonServerSideProps
            ])),
        },
    };
}

export default withErrorAnnouncer(Launch);
