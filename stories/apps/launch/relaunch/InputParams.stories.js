import React from "react";

import AppLaunchStoryBase from "../AppLaunchStoryBase";
import InputParamsApp from "../data/InputParamsApp";

export const InputParamsRelaunch = () => {
    const [
        {
            parameters: [fileInput, folderInput, multiInput, ...parameters],
            ...inputGroup
        },
        ...groups
    ] = InputParamsApp.groups;

    const fileValue = {
        path: "/iplant/home/aramsey/CORE-9077_test_file.txt",
    };

    const folderValue = {
        path: "/iplant/home/aramsey/bad'name",
    };

    const multiFileValue = {
        path: [
            "/iplant/home/aramsey/CORE-9077-path.list",
            "/iplant/home/aramsey/CORE-9077_test_file.txt",
            "/iplant/home/aramsey/Discovery Environment-CyVerse-blue.svg",
        ],
    };

    const app = {
        ...InputParamsApp,
        description:
            "This relaunch story should have preset values for all" +
            " file and folder input fields.",
        groups: [
            {
                ...inputGroup,
                parameters: [
                    {
                        ...fileInput,
                        value: fileValue,
                        defaultValue: fileValue,
                    },
                    {
                        ...folderInput,
                        value: folderValue,
                        defaultValue: folderValue,
                    },
                    {
                        ...multiInput,
                        value: multiFileValue,
                        defaultValue: multiFileValue,
                    },
                    ...parameters,
                ],
            },
            ...groups,
        ],
    };

    return <AppLaunchStoryBase app={app} />;
};

export default { title: "Apps / Launch / Relaunch-Input Params" };
