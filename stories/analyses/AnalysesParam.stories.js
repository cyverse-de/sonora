import React from "react";

import { mockAxios, errorResponseJSON } from "../axiosMock";

import { params } from "./AnalysesMocks";

import ParamsPanel from "components/analyses/details/ParamsPanel";
import { UploadTrackingProvider } from "contexts/uploadTracking";

export default {
    title: "Analyses / Param",
};

export function AnalysisParamTest(props) {
    mockAxios.onPost("/api/filesystem/stat").replyOnce(404, {
        error_code: "ERR_DOES_NOT_EXIST",
        reason: "Not Found!",
    });
    mockAxios.onPost("/api/filesystem/stat").replyOnce(500, errorResponseJSON);
    mockAxios.onPost("/api/filesystem/stat").reply((config) => {
        const req = JSON.parse(config.data);
        const path = req.paths[0];

        return [
            200,
            {
                paths: { [path]: { path } },
            },
        ];
    });

    return (
        <UploadTrackingProvider>
            <ParamsPanel parameters={params.parameters} baseId="baseParamId" />
        </UploadTrackingProvider>
    );
}
