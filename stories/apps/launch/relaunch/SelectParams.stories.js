import React from "react";

import AppLaunchStoryBase from "../AppLaunchStoryBase";
import SelectParamsApp from "../data/SelectParamsApp";

export const SelectParamsRelaunch = () => {
    const [{ parameters, ...listGroup }] = SelectParamsApp.groups;

    const requiredTextListValue = {
        isDefault: true,
        display: "Value 3",
        id: "abc0c332-5ce1-11ea-8af3-008cfa5ae621",
        name: "--required-list",
        value: "val3",
    };

    const intListValue = {
        name: "--int-list",
        isDefault: false,
        id: "e9de1a06-5ce2-11ea-aa6d-008cfa5ae621",
        display: "3",
        value: "Value 3",
    };

    const app = {
        ...SelectParamsApp,
        description:
            'This relaunch story should have "3" preset for the' +
            ' "Integer List" field, when the app default is normally "2",' +
            ' and "Value 3" preset for the "Required Text List" field.',
        groups: [
            {
                ...listGroup,
                parameters: parameters.map((param) => {
                    if (param.label === "Required Text List") {
                        return {
                            ...param,
                            value: requiredTextListValue,
                            defaultValue: requiredTextListValue,
                        };
                    }

                    if (param.label === "Integer List") {
                        return {
                            ...param,
                            value: intListValue,
                            defaultValue: intListValue,
                        };
                    }

                    return param;
                }),
            },
        ],
    };

    return <AppLaunchStoryBase app={app} />;
};

export default { title: "Apps / Launch / Relaunch" };
