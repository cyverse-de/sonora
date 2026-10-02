import React from "react";

import { mockResourcePresets } from "./constants";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import NoParamsApp from "./data/JupyterLabNoParamsApp";

export const JupyterLabNoParams = () => (
    <AppLaunchStoryBase
        app={NoParamsApp}
        resourcePresets={mockResourcePresets}
    />
);
