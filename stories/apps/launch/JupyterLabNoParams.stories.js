import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import NoParamsApp from "./data/JupyterLabNoParamsApp";

export const JupyterLabNoParams = () => (
    <AppLaunchStoryBase app={NoParamsApp} />
);

export default { title: "Apps / Launch" };
