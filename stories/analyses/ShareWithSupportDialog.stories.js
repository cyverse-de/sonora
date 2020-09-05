import React from "react";

import { withKnobs, select } from "@storybook/addon-knobs";

import { deWordCountAnalysis, agaveWordCountAnalysis } from "./AnalysesMocks";

import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";

export const ShareAnalysisWithSupport = () => {
    const analysisSystemSelect = select(
        "Analysis System",
        {
            de: deWordCountAnalysis,
            agave: agaveWordCountAnalysis,
        },
        deWordCountAnalysis
    );

    const analysisStatusSelect = select(
        "Analysis Status",
        {
            Submitted: "Submitted",
            Running: "Running",
            Completed: "Completed",
            Failed: "Failed",
        },
        "Submitted"
    );

    const analysis = {
        ...analysisSystemSelect,
        status: analysisStatusSelect,
    };

    return (
        <ShareWithSupportDialog
            baseId={"analyses"}
            open={true}
            analysis={analysis}
            name={"IpcDev"}
            email={"ipcdev@cyverse.org"}
            onShareWithSupport={(analysis, comment, supportRequested) =>
                console.log(
                    "onShareWithSupport",
                    analysis,
                    comment,
                    supportRequested
                )
            }
        />
    );
};

export default {
    title: "Analyses",
    decorators: [withKnobs],
};
