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
            "/api/analyses?filter=[{%22field%22%3A%22id%22%2C%22value%22%3A%22727c6ffe-7d8e-11ea-bedd-c2a97b34bb42%22}]"
        )
        .reply(200, deWordCountAnalysis);
    mockAxios
        .onGet("/api/analyses/727c6ffe-7d8e-11ea-bedd-c2a97b34bb42/history")
        .reply(200, info);
    mockAxios
        .onGet("/api/analyses/727c6ffe-7d8e-11ea-bedd-c2a97b34bb42/parameters")
        .reply(200, params);

    return (
        <AnalysisSubmissionLanding
            id="727c6ffe-7d8e-11ea-bedd-c2a97b34bb42"
            baseId="submissionLanding"
        />
    );
};
