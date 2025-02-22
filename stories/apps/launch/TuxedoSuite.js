import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import TuxedoSuiteApp from "./data/TuxedoSuite";
import { initMockAxiosReferenceGenomeListing } from "./data/ReferenceGenomeListing";

export const TuxedoSuite = () => {
    initMockAxiosReferenceGenomeListing();

    return <AppLaunchStoryBase app={TuxedoSuiteApp} />;
};
