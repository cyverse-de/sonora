import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import DeprecatedParamsApp from "./data/DeprecatedParamsApp";

import { withKnobs, boolean } from "@storybook/addon-knobs";

export const DeprecatedParams = () => {
    const deleted = boolean("App deleted", false);
    const disabled = boolean("App disabled", false);

    const app = { ...DeprecatedParamsApp, deleted, disabled };

    return <AppLaunchStoryBase app={app} />;
};

export default { title: "Apps / Launch", decorators: [withKnobs] };
