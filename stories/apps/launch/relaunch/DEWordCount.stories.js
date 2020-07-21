import React from "react";

import constants from "../../../../src/constants";

import AppLaunchStoryBase from "../AppLaunchStoryBase";
import WordCountApp from "../data/WordCountApp";

export const DEWordCountRelaunch = () => {
    const [
        {
            parameters: [fileInput],
            ...inputGroup
        },
    ] = WordCountApp.groups;

    const fileValue = {
        path: "/iplant/home/aramsey/CORE-9077_test_file.txt",
    };

    const app = {
        ...WordCountApp,
        description:
            "This relaunch story should have preset values for the input file" +
            " and for all resource requirements.",
        requirements: [
            {
                step_number: 0,
                default_memory: 2147483648,
                default_disk_space: 1073741824,
                default_cpu_cores: 1,
            },
        ],
        groups: [
            {
                ...inputGroup,
                parameters: [
                    {
                        ...fileInput,
                        value: fileValue,
                        defaultValue: fileValue,
                    },
                ],
            },
        ],
    };

    return (
        <AppLaunchStoryBase
            app={app}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * constants.ONE_GiB}
            defaultMaxDiskSpace={64 * constants.ONE_GiB}
        />
    );
};

export default { title: "Apps / Launch / Relaunch" };
