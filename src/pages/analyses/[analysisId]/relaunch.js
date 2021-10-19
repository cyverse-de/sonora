/**
 * @author psarando
 *
 * A page for displaying the App Launch Wizard for a relaunch of the analysis
 * with the given ID.
 */
import React from "react";

import { useRouter } from "next/router";
import { useQuery } from "react-query";

import constants from "../../../constants";
import {
    getAnalysisRelaunchInfo,
    ANALYSIS_RELAUNCH_QUERY_KEY,
} from "serviceFacades/analyses";

import AppLaunch from "components/apps/launch";
import { useUserProfile } from "contexts/userProfile";

const Relaunch = () => {
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

    const loading = relaunchStatus === constants.LOADING;

    return (
        <AppLaunch
            app={app}
            launchError={relaunchError}
            loading={loading}
            viceQuota={viceQuota}
            runningJobs={runningJobs}
            pendingRequest={hasPendingRequest}
        />
    );
};

export default Relaunch;
Relaunch.getInitialProps = async () => ({
    namespacesRequired: ["launch"],
});
