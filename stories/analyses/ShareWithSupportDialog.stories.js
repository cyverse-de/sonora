import React from "react";

import { withKnobs, select } from "@storybook/addon-knobs";

import { deWordCountAnalysis, agaveWordCountAnalysis } from "./AnalysesMocks";

import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";

export const ShareAnalysisWithSupport = () => {
    const [loading, setLoading] = React.useState(false);

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
            loading={loading}
            analysis={analysis}
            name={"IpcDev"}
            email={"ipcdev@cyverse.org"}
            onClose={() => console.log("Dialog closed.")}
            onShareWithSupport={(analysis, comment) => {
                setLoading(true);
                setTimeout(() => {
                    console.log("onShareWithSupport", analysis, comment);
                    setLoading(false);
                }, 1000);
            }}
        />
    );
};

export default {
    title: "Analyses",
    decorators: [withKnobs],
};
