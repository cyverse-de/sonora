import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import DeprecatedParamsApp from "./data/DeprecatedParamsApp";

export const DeprecatedParams = ({ deleted, disabled }) => {
    const app = { ...DeprecatedParamsApp, deleted, disabled };

    return <AppLaunchStoryBase app={app} />;
};

DeprecatedParams.argTypes = {
    deleted: {
        name: "Deleted",
        control: {
            type: "boolean",
        },
    },
    disabled: {
        name: "Disabled",
        control: {
            type: "boolean",
        },
    },
};

DeprecatedParams.args = {
    deleted: false,
    disabled: false,
};
