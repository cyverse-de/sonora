import React from "react";

import AppLaunchStoryBase from "./AppLaunchStoryBase";
import DeprecatedParamsApp from "./data/DeprecatedParamsApp";

export const DeprecatedParams = ({ deleted, disabled }) => {
    const app = { ...DeprecatedParamsApp, deleted, disabled };

    return <AppLaunchStoryBase app={app} />;
};

export default {
    title: "Apps / Launch / Deprecated",
    component: AppLaunchStoryBase,
    argTypes: {
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
    },
};
