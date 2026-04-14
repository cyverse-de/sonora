/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for a relaunch of the analysis
 * with the given ID.
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "@tanstack/react-query";

import { i18n, RequiredNamespaces } from "i18n";

import {
    getAnalysisRelaunchInfo,
    ANALYSIS_RELAUNCH_QUERY_KEY,
} from "serviceFacades/analyses";

import useResourceUsageSummary from "common/useResourceUsageSummary";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

const Relaunch = ({ showErrorAnnouncer }) => {
    const [userProfile] = useUserProfile();
    const [relaunchKey, setRelaunchKey] = React.useState(
        ANALYSIS_RELAUNCH_QUERY_KEY
    );
    const [relaunchQueryEnabled, setRelaunchQueryEnabled] =
        React.useState(false);

    const router = useRouter();
    const { analysisId } = router.query;

    const { isFetchingUsageSummary, computeLimitExceeded } =
        useResourceUsageSummary(showErrorAnnouncer);

    React.useEffect(() => {
        setRelaunchQueryEnabled(!!analysisId);

        if (analysisId) {
            setRelaunchKey([
                ANALYSIS_RELAUNCH_QUERY_KEY,
                {
                    id: analysisId,
                },
            ]);
        }
    }, [analysisId, setRelaunchQueryEnabled]);

    const {
        isFetching: isFetchingRelaunchInfo,
        data: app,
        error: relaunchError,
    } = useQuery({
        queryKey: relaunchKey,
        queryFn: () => getAnalysisRelaunchInfo(relaunchKey[1]),
        enabled: relaunchQueryEnabled,
    });

    const canRun = app?.limitChecks?.canRun || !userProfile?.id;
    const limitCheck = !canRun && app?.limitChecks?.results[0];
    const limitCheckReason = limitCheck?.reasonCodes?.[0];
    const viceQuota = limitCheck?.additionalInfo?.maxJobs;
    const runningJobs = limitCheck?.additionalInfo?.runningJobs;
    const hasPendingRequest = limitCheck?.additionalInfo?.pendingRequest;

    const loading = isFetchingRelaunchInfo || isFetchingUsageSummary;

    return (
        <AppLaunch
            app={app}
            launchError={relaunchError || limitCheckReason}
            loading={loading}
            viceQuota={viceQuota}
            runningJobs={runningJobs}
            pendingRequest={hasPendingRequest}
            computeLimitExceeded={computeLimitExceeded}
        />
    );
};

export async function getServerSideProps({ locale }) {
    const title = i18n.t("analyses:relaunch");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "data",
                "launch",
                "preferences",
                "upload",
                "urlImport",
                // "apps" and "analyses" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default withErrorAnnouncer(Relaunch);
