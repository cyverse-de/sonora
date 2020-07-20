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
} from "../../../serviceFacades/analyses";

import AppLaunch from "../../../components/apps/launch";

export default () => {
    const [relaunchKey, setRelaunchKey] = React.useState(
        ANALYSIS_RELAUNCH_QUERY_KEY
    );
    const [relaunchQueryEnabled, setRelaunchQueryEnabled] = React.useState(
        false
    );

    const [app, setApp] = React.useState(null);
    const [relaunchError, setRelaunchError] = React.useState(null);

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
        queryFn: getAnalysisRelaunchInfo,
        config: {
            enabled: relaunchQueryEnabled,
            onSuccess: setApp,
            onError: setRelaunchError,
        },
    });

    const loading = relaunchStatus === constants.LOADING;

    return (
        <AppLaunch app={app} launchError={relaunchError} loading={loading} />
    );
};
