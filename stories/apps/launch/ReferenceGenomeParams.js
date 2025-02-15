import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import ReferenceGenomeApp from "./data/ReferenceGenomeApp";
import { initMockAxiosReferenceGenomeListing } from "./data/ReferenceGenomeListing";

export const ReferenceGenomeParams = () => {
    initMockAxiosReferenceGenomeListing();

    return <AppLaunchStoryBase app={ReferenceGenomeApp} />;
};
