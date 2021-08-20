/**
 * @author aramsey
 *
 * A hook to return how long an analysis has been running.
 *
 * The run time is based off the analysis history's first recorded Running update
 * for a specified step. You can specify the step by providing a function to filter
 * for that step.  By default, the first step will be used.
 *
 * Updates the values every minute.
 */

import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { useQuery } from "react-query";

import analysisStatus from "components/models/analysisStatus";
import {
    ANALYSIS_HISTORY_QUERY_KEY,
    getAnalysisHistory,
} from "serviceFacades/analyses";

function useAnalysisRunTime(
    analysis,
    stepFilterFn = (step) => step.step_number === 1
) {
    const isRunning = analysis?.status === analysisStatus.RUNNING;

    const [runningStart, setRunningStart] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(null);

    useQuery({
        queryKey: [ANALYSIS_HISTORY_QUERY_KEY, { id: analysis?.id }],
        queryFn: getAnalysisHistory,
        config: {
            enabled: !!isRunning,
            onSuccess: (resp) => {
                // Make sure we're looking at the correct step
                // (e.g. step_type === "Interactive" or step_number === 1)
                const step = resp?.steps?.find(stepFilterFn);
                // Find the first Running update
                const runningUpdate = step?.updates?.find(
                    (update) => update.status === analysisStatus.RUNNING
                );
                // Record the timestamp
                setRunningStart(parseInt(runningUpdate.timestamp));
            },
        },
    });

    useEffect(() => {
        const handleUpdateRunningTime = () => {
            setElapsedTime(formatDistanceToNow(new Date(runningStart)));
        };

        let interval;
        if (runningStart) {
            interval = setInterval(handleUpdateRunningTime, 60000);
            handleUpdateRunningTime();
        }

        return () => clearInterval(interval);
    }, [analysis, runningStart]);

    return { elapsedTime, runningStart };
}

export default useAnalysisRunTime;
