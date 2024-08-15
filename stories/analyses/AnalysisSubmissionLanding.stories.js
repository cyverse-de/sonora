import React from "react";
import { useQueryClient } from "react-query";
import { AXIOS_DELAY, mockAxios } from "../axiosMock";
import {
    deWordCountAnalysis,
    runningVICEAnalysis,
    params,
    info,
} from "./AnalysesMocks";

import AnalysisSubmissionLanding from "components/analyses/landing/AnalysisSubmissionLanding";
import { VICE_TIME_LIMIT_QUERY_KEY } from "serviceFacades/analyses";
import { convertTimeLimitArgType, TimeLimitArgType } from "./ArgTypes";

export default {
    title: "Analyses / Submission Landing",
};

export const AnalysisSubmissionLandingTest = ({ analysis, timeLimit }) => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        queryClient.invalidateQueries(VICE_TIME_LIMIT_QUERY_KEY);
    }, [timeLimit, queryClient]);

    mockAxios.reset();
    mockAxios
        .onGet(`/api/analyses?filter=[{"field":"id","value":"${analysis.id}"}]`)
        .reply(200, { analyses: [analysis] });
    mockAxios.onGet(`/api/analyses/${analysis.id}/history`).reply(200, info);
    mockAxios
        .onGet(`/api/analyses/${analysis.id}/parameters`)
        .reply(200, params);
    mockAxios
        .onGet(new RegExp("/api/analyses/.*/time-limit"))
        .reply(200, { time_limit: convertTimeLimitArgType(timeLimit) });

    return (
        <AnalysisSubmissionLanding
            id={analysis.id}
            baseId="submissionLanding"
        />
    );
};
AnalysisSubmissionLandingTest.parameters = {
    chromatic: { delay: AXIOS_DELAY * 2 },
};
AnalysisSubmissionLandingTest.args = {
    analysis: "DE",
    timeLimit: "null",
};
AnalysisSubmissionLandingTest.argTypes = {
    analysis: {
        options: ["DE", "VICE"],
        mapping: {
            DE: deWordCountAnalysis,
            VICE: runningVICEAnalysis,
        },
        control: { type: "select" },
    },
    ...TimeLimitArgType,
};
