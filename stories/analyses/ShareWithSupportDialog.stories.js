import React from "react";

import { deWordCountAnalysis, agaveWordCountAnalysis } from "./AnalysesMocks";

import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";

const analysisSystem = ["de", "agave"];
const status = ["Submitted", "Running", "Completed", "Failed"];

export const ShareAnalysisWithSupport = ({ system, status }) => {
    const [loading, setLoading] = React.useState(false);
    let analysis = {};

    if (system === "de") {
        analysis = {
            ...deWordCountAnalysis,
            status,
        };
    } else {
        analysis = {
            ...agaveWordCountAnalysis,
            status,
        };
    }

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
    component: ShareWithSupportDialog,
    argTypes: {
        system: {
            control: {
                type: "select",
                options: analysisSystem,
            },
        },
        status: {
            control: {
                type: "select",
                options: status,
            },
        },
    },
};
