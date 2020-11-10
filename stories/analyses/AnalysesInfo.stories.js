import React from "react";
import InfoPanel from "../../src/components/analyses/details/InfoPanel";
import { info } from "./AnalysesMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

export default {
    title: "Analyses / Info",
};

export function AnalysisInfoTest(props) {
    return (
        <UploadTrackingProvider>
            <InfoPanel info={info} baseId="baseInfoId" />
        </UploadTrackingProvider>
    );
}
