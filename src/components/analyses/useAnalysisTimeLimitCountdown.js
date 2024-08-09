/**
 * @author psarando
 *
 * A hook to return a running VICE analysis' time limit and formatted countdown.
 *
 * The time limit is based on the value returned by the
 * `/analyses/${id}/time-limit` endpoint, and converted into milliseconds.
 *
 * The countdown timer value is calculated from this time limit value,
 * and formatted with `date-fns/formatDuration`.
 *
 * Updates the countdown timer value every second.
 */

import { useEffect, useState } from "react";

import { formatDuration, intervalToDuration, toDate } from "date-fns";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import {
    VICE_TIME_LIMIT_QUERY_KEY,
    getTimeLimitForVICEAnalysis,
} from "serviceFacades/analyses";

import { isInteractiveRunning } from "./utils";

const timeLimitToCountdown = (timeLimitMS) => {
    if (timeLimitMS > 0) {
        const start = new Date();
        const end = toDate(parseInt(timeLimitMS, 10));

        if (end > start) {
            return formatDuration(intervalToDuration({ start, end }));
        }
    }

    return null;
};

function useAnalysisTimeLimitCountdown(analysis, showErrorAnnouncer) {
    const [timeLimit, setTimeLimit] = useState();
    const [timeLimitCountdown, setTimeLimitCountdown] = useState();

    const { t } = useTranslation("analyses");

    const runningVICE = isInteractiveRunning(analysis);

    useQuery({
        queryKey: [VICE_TIME_LIMIT_QUERY_KEY, analysis?.id],
        queryFn: () => getTimeLimitForVICEAnalysis(analysis?.id),
        enabled: !!analysis?.id && runningVICE,
        onSuccess: (resp) => {
            //convert the response from seconds to milliseconds
            const timeLimitMS = resp?.time_limit * 1000;
            setTimeLimit(timeLimitMS || null);
            setTimeLimitCountdown(timeLimitToCountdown(timeLimitMS));
        },
        onError: (error) => {
            if (showErrorAnnouncer) {
                showErrorAnnouncer(t("timeLimitError"), error);
            } else {
                console.error(t("timeLimitError"), error);
            }
        },
    });

    useEffect(() => {
        const handleUpdateRunningTime = () => {
            setTimeLimitCountdown(timeLimitToCountdown(timeLimit));
        };

        let interval;
        if (runningVICE) {
            interval = setInterval(handleUpdateRunningTime, 1000);
            handleUpdateRunningTime();
        } else {
            setTimeLimitCountdown(null);
        }

        return () => clearInterval(interval);
    }, [analysis, runningVICE, timeLimit]);

    return { timeLimit, timeLimitCountdown };
}

export default useAnalysisTimeLimitCountdown;
