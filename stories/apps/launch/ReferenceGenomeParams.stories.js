import React from "react";

import AppLaunchWizard from "../../../src/components/apps/launch/AppLaunchWizard";

import { mockAxios } from "../../axiosMock";

import ReferenceGenomeApp from "./data/ReferenceGenomeApp";
import ReferenceGenomeListing from "./data/ReferenceGenomeListing";

import { ANALYSIS_OUTPUT_DIR, submitAnalysis } from "./constants";

export const ReferenceGenomeParams = () => {
    mockAxios
        .onGet(/\/api\/reference-genomes/)
        .reply(200, ReferenceGenomeListing);

    return (
        <AppLaunchWizard
            notify={false}
            output_dir={ANALYSIS_OUTPUT_DIR}
            submitAnalysis={submitAnalysis}
            app={ReferenceGenomeApp}
        />
    );
};

export default { title: "Apps / Launch" };
