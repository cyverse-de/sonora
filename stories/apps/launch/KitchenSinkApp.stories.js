import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import KitchenSinkApp from "./data/KitchenSinkApp";
import { initMockAxiosReferenceGenomeListing } from "./data/ReferenceGenomeListing";

export const KitchenSinkParams = () => {
    initMockAxiosReferenceGenomeListing();

    return <AppLaunchStoryBase app={KitchenSinkApp} />;
};
