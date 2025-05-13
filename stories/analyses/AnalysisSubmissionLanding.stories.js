import React from "react";
import { useQueryClient } from "react-query";
import { AXIOS_DELAY, mockAxios } from "../axiosMock";
import {
    usageSummaryResponse,
    usageSummaryBasicSubscriptionResponse,
    usageSummaryBasicSubscriptionAddonsResponse,
} from "../usageSummaryMock";
import {
    deWordCountAnalysis,
    runningVICEAnalysis,
    params,
    info,
} from "./AnalysesMocks";

import AnalysisSubmissionLanding from "components/analyses/landing/AnalysisSubmissionLanding";
import { NotificationsProvider } from "contexts/pushNotifications";
import { VICE_TIME_LIMIT_QUERY_KEY } from "serviceFacades/analyses";
import { convertTimeLimitArgType, TimeLimitArgType } from "./ArgTypes";

export default {
    title: "Analyses / Submission Landing",
};

const AnalysisSubmissionLandingTemplate = ({
    analysis,
    timeLimit,
    usageSummaryResponse,
}) => {
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
    mockAxios
        .onGet(new RegExp("/api/resource-usage/summary.*"))
        .reply(200, usageSummaryResponse);

    return (
        <NotificationsProvider wsEnabled={false}>
            <AnalysisSubmissionLanding
                id={analysis.id}
                baseId="submissionLanding"
            />
        </NotificationsProvider>
    );
};
const parameters = {
    chromatic: { delay: AXIOS_DELAY * 2 },
};
const args = {
    analysis: "DE",
    timeLimit: "null",
};
const argTypes = {
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

export const NormalLanding = AnalysisSubmissionLandingTemplate.bind({});
NormalLanding.parameters = parameters;
NormalLanding.args = { ...args, usageSummaryResponse };
NormalLanding.argTypes = argTypes;

export const BasicSubscriptionLanding = AnalysisSubmissionLandingTemplate.bind(
    {}
);
BasicSubscriptionLanding.parameters = parameters;
BasicSubscriptionLanding.args = {
    ...args,
    usageSummaryResponse: usageSummaryBasicSubscriptionResponse,
};
BasicSubscriptionLanding.argTypes = argTypes;

export const BasicSubscriptionWithAddonsLanding =
    AnalysisSubmissionLandingTemplate.bind({});
BasicSubscriptionWithAddonsLanding.parameters = parameters;
BasicSubscriptionWithAddonsLanding.args = {
    ...args,
    usageSummaryResponse: usageSummaryBasicSubscriptionAddonsResponse,
};
BasicSubscriptionWithAddonsLanding.argTypes = argTypes;
