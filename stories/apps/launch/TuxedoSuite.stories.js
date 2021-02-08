import React from "react";

import { mockAxios } from "../../axiosMock";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import TuxedoSuiteApp from "./data/TuxedoSuite";
import ReferenceGenomeListing from "./data/ReferenceGenomeListing";

export const TuxedoSuite = () => {
    mockAxios
        .onGet(/\/api\/reference-genomes/)
        .reply(200, ReferenceGenomeListing);

    return <AppLaunchStoryBase app={TuxedoSuiteApp} />;
};
