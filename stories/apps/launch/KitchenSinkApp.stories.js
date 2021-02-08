import React from "react";

import { mockAxios } from "../../axiosMock";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import KitchenSinkApp from "./data/KitchenSinkApp";
import ReferenceGenomeListing from "./data/ReferenceGenomeListing";

export const KitchenSinkParams = () => {
    mockAxios
        .onGet(/\/api\/reference-genomes/)
        .reply(200, ReferenceGenomeListing);

    return <AppLaunchStoryBase app={KitchenSinkApp} />;
};
