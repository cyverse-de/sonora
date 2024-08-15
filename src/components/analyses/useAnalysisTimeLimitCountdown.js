/**
 * @author psarando
 *
 * A hook to return a running VICE analysis' time limit and formatted countdown.
 *
 * The time limit is based on the value returned by the
 * `/analyses/${id}/time-limit` endpoint, and converted into milliseconds.
 *
 * The countdown timer value is calculated from this time limit value,
 * and formatted as `HH:MM`.
 *
 * Updates the countdown timer value every minute.
 */

import { useEffect, useState } from "react";

import { millisecondsToHours, millisecondsToMinutes, toDate } from "date-fns";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import {
    VICE_TIME_LIMIT_QUERY_KEY,
    getTimeLimitForVICEAnalysis,
} from "serviceFacades/analyses";

import { isInteractiveRunning } from "./utils";

const timeLimitToCountdown = (timeLimitMS) => {
    if (timeLimitMS > 0) {
        const now = new Date();
        const end = toDate(timeLimitMS);

        if (end > now) {
            const millisRemaining = end - now;
            const hours = millisecondsToHours(millisRemaining);
            const mins = millisecondsToMinutes(millisRemaining) - hours * 60;
            if (mins > 0 || hours > 0) {
                return [hours, mins]
                    .map((n) => String(n).padStart(2, "0"))
                    .join(":");
            }
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
            interval = setInterval(handleUpdateRunningTime, 60 * 1000);
            handleUpdateRunningTime();
        } else {
            setTimeLimitCountdown(null);
        }

        return () => clearInterval(interval);
    }, [analysis, runningVICE, timeLimit]);

    return { timeLimit, timeLimitCountdown };
}

export default useAnalysisTimeLimitCountdown;
