import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import DeprecatedParamsApp from "./data/DeprecatedParamsApp";

export const DeprecatedParams = ({ deleted, disabled }) => {
    const app = { ...DeprecatedParamsApp, deleted, disabled };

    return <AppLaunchStoryBase app={app} />;
};

DeprecatedParams.argTypes = {
    deleted: {
        control: {
            type: "boolean",
        },
    },
    disabled: {
        control: {
            type: "boolean",
        },
    },
};
