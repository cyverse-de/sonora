/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for a relaunch of the analysis
 * with the given ID.
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "react-query";

import { i18n, RequiredNamespaces, useTranslation } from "i18n";

import constants from "../../../constants";
import {
    getAnalysisRelaunchInfo,
    ANALYSIS_RELAUNCH_QUERY_KEY,
} from "serviceFacades/analyses";

import { getResourceUsageSummary } from "serviceFacades/dashboard";
import { useConfig } from "contexts/config";
import { getUserQuota } from "../../../common/resourceUsage";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

import { APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY } from "pages/apps/[systemId]/[appId]/launch";

const Relaunch = ({ showErrorAnnouncer }) => {
    const { t } = useTranslation("common");
    const [config] = useConfig();
    const [userProfile] = useUserProfile();
    const [relaunchKey, setRelaunchKey] = React.useState(
        ANALYSIS_RELAUNCH_QUERY_KEY
    );
    const [relaunchQueryEnabled, setRelaunchQueryEnabled] =
        React.useState(false);

    const [app, setApp] = React.useState(null);
    const [relaunchError, setRelaunchError] = React.useState(null);
    const [viceQuota, setViceQuota] = React.useState();
    const [runningJobs, setRunningJobs] = React.useState();
    const [hasPendingRequest, setHasPendingRequest] = React.useState();
    const [computeLimitExceeded, setComputeLimitExceeded] = React.useState(
        !!config?.subscriptions?.enforce
    );

    const router = useRouter();
    const { analysisId } = router.query;

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

    const { status: relaunchStatus } = useQuery({
        queryKey: relaunchKey,
        queryFn: () => getAnalysisRelaunchInfo(relaunchKey[1]),
        enabled: relaunchQueryEnabled,
        onSuccess: (resp) => {
            if (resp?.limitChecks?.canRun || !userProfile?.id) {
                setApp(resp);
            } else {
                setRelaunchError(resp?.limitChecks?.results[0]?.reasonCodes[0]);
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
        onError: setRelaunchError,
    });

    const { isFetching: fetchingUsageSummary } = useQuery({
        queryKey: [APP_LAUNCH_RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce && !!userProfile?.id,
        onSuccess: (respData) => {
            const usage = respData?.cpu_usage?.total || 0;
            const subscription = respData?.subscription;
            const quota = getUserQuota(
                constants.CPU_HOURS_RESOURCE_NAME,
                subscription
            );
            setComputeLimitExceeded(usage >= quota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const loading =
        relaunchStatus === constants.LOADING || fetchingUsageSummary;

    return (
        <AppLaunch
            app={app}
            launchError={relaunchError}
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
                "upload",
                "urlImport",
                // "apps" and "analyses" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default withErrorAnnouncer(Relaunch);
