import React from "react";
import ParamsPanel from "../../src/components/analyses/details/ParamsPanel";
import { params } from "./AnalysesMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

export default {
    title: "Analyses / Param",
};

export function AnalysisParamTest(props) {
    return (
        <UploadTrackingProvider>
            <ParamsPanel parameters={params.parameters} baseId="baseParamId" />
        </UploadTrackingProvider>
    );
}
