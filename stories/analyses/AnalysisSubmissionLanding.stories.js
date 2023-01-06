import React from "react";
import { mockAxios } from "../axiosMock";
import { deWordCountAnalysis, params, info } from "./AnalysesMocks";

import AnalysisSubmissionLanding from "components/analyses/landing/AnalysisSubmissionLanding";

export default {
    title: "Submission Landing",
};

export const AnalysisSubmissionLandingTest = () => {
    mockAxios
        .onGet(
            `/api/analyses?filter=[{"field":"id","value":"${deWordCountAnalysis.id}"}]`
        )
        .reply(200, { analyses: [deWordCountAnalysis] });
    mockAxios
        .onGet(`/api/analyses/${deWordCountAnalysis.id}/history`)
        .reply(200, info);
    mockAxios
        .onGet(`/api/analyses/${deWordCountAnalysis.id}/parameters`)
        .reply(200, params);

    return (
        <AnalysisSubmissionLanding
            id={deWordCountAnalysis.id}
            baseId="submissionLanding"
        />
    );
};
