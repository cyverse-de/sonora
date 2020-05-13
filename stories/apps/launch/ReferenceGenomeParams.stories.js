import React from "react";

import { mockAxios } from "../../axiosMock";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import ReferenceGenomeApp from "./data/ReferenceGenomeApp";
import ReferenceGenomeListing from "./data/ReferenceGenomeListing";

export const ReferenceGenomeParams = () => {
    mockAxios
        .onGet(/\/api\/reference-genomes/)
        .reply(200, ReferenceGenomeListing);

    return <AppLaunchStoryBase app={ReferenceGenomeApp} />;
};

export default { title: "Apps / Launch" };
