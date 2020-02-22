import React from "react";
import AppLaunchWizard from "../../src/components/apps/launch/AppLaunchWizard";

const ONE_GB = 1024 * 1024 * 1024;

const submitAnalysis = (submission, onSuccess, onError) => {
    setTimeout(() => {
        console.log(submission);
        onSuccess("success!");
    }, 1000);
};

const appWordCount = {
    description: "Counts the number of words in a file",
    requirements: [
        {
            step_number: 0,
        },
    ],
    deleted: false,
    disabled: false,
    name: "DE Word Count",
    system_id: "de",
    label: "DE Word Count",
    id: "67d15627-22c5-42bd-8daf-9af5deecceab",
    app_type: "DE",
    groups: [
        {
            id: "741711b0-0b95-4ac9-98b4-ca58225e76be",
            name: "",
            label: "Parameters",
            parameters: [
                {
                    description: "The file to count words in.",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "Input Filename",
                    id:
                        "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 0,
        },
    ],
};

const appNumberParams = {
    description: "number params",
    requirements: [
        {
            step_number: 0,
        },
    ],
    deleted: false,
    disabled: false,
    name: "test number params",
    system_id: "de",
    label: "test number params",
    id: "ddef9b02-5751-11ea-b2f6-008cfa5ae621",
    app_type: "DE",
    groups: [
        {
            id: "ddf164b4-5751-11ea-b2f6-008cfa5ae621",
            name: "",
            label: "Number inputs",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label: "Enter some numbers below...",
                    id:
                        "ddf03cb0-5751-11ea-b2f6-008cfa5ae621_ddf1a172-5751-11ea-b2f6-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Integer",
                    validators: [],
                    label: "Integer",
                    id:
                        "ddf03cb0-5751-11ea-b2f6-008cfa5ae621_ddf1e3bc-5751-11ea-b2f6-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "1",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Double",
                    validators: [],
                    label: "Decimal",
                    id:
                        "ddf03cb0-5751-11ea-b2f6-008cfa5ae621_ddf23c5e-5751-11ea-b2f6-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "1.23",
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

const appPipeline = {
    description: "testing",
    requirements: [
        {
            max_cpu_cores: 4,
            memory_limit: 8 * ONE_GB,
            step_number: 0,
        },
        {
            step_number: 1,
        },
    ],
    deleted: false,
    disabled: false,
    name: "test pipeline params",
    system_id: "de",
    label: "test pipeline params",
    id: "4b8214a0-254f-45dc-ba6a-0587a7228b5c",
    app_type: "DE",
    groups: [
        {
            id: "05a2ad8f-c452-4cdb-ad0a-774c879b8868",
            name: "Word Count - ",
            label: "Word Count - Input data",
            parameters: [
                {
                    description: "Select file to analyze.",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "Select an input file",
                    id:
                        "6790a642-854a-11e4-b4c9-27b8156a741a_2f58fce9-8183-4ab5-97c4-970592d1c35a",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 0,
        },
        {
            id: "14019b2f-0ead-4f4b-a3ec-a881cb440b0c",
            name: "Concatenate 2 Files-workflow edition. - ",
            label: "Concatenate 2 Files-workflow edition. - Select input data",
            parameters: [
                {
                    description: "Enter the first file here.",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "First File",
                    id:
                        "6790a76e-854a-11e4-bf11-6f99489b3e09_f744f05b-e8d4-4428-84e9-934431c304af",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 1,
        },
        {
            id: "ddbcb9af-75cf-4df9-bc2e-912e5a57df44",
            name: "Concatenate 2 Files-workflow edition. - ",
            label: "Concatenate 2 Files-workflow edition. - Output files",
            parameters: [
                {
                    description: "Give a name to your output file.",
                    arguments: [],
                    name: "",
                    type: "FileOutput",
                    validators: [],
                    label: "concatenate_out.txt",
                    id:
                        "6790a76e-854a-11e4-bf11-6f99489b3e09_14a78d0a-21f1-428c-9279-d803043ae99d",
                    isVisible: true,
                    defaultValue: "concatentate_out.txt",
                    required: true,
                },
            ],
            step_number: 1,
        },
    ],
};

const appNoParams = {
    description:
        "Launches a Jupyter Lab with ScyPy \n\nMaintained here: https://github.com/cyverse-vice/jupyterlab-scipy ",
    requirements: [
        {
            step_number: 0,
            max_cpu_cores: 16,
            memory_limit: 64 * ONE_GB,
            default_cpu_cores: 8,
            default_memory: 32 * ONE_GB,
            default_disk_space: 128 * ONE_GB,
        },
    ],
    deleted: false,
    disabled: false,
    name: "private Jupyter Lab no params",
    system_id: "de",
    label: "private Jupyter Lab no params",
    id: "4dcda8a6-5761-11ea-bd06-008cfa5ae621",
    app_type: "DE",
    groups: [],
};

export const DEWordCount = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir="/iplant/home/dev/analyses_qa"
            app={appWordCount}
            submitAnalysis={submitAnalysis}
            defaultMaxCPUCores={8}
            defaultMaxMemory={4 * ONE_GB}
            defaultMaxDiskSpace={64 * ONE_GB}
        />
    );
};

export const NumberParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir="/iplant/home/dev/analyses_qa"
            app={appNumberParams}
            submitAnalysis={submitAnalysis}
        />
    );
};

export const Pipline = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir="/iplant/home/dev/analyses_qa"
            app={appPipeline}
            submitAnalysis={submitAnalysis}
        />
    );
};

export const NoParams = () => {
    return (
        <AppLaunchWizard
            notify={false}
            output_dir="/iplant/home/dev/analyses_qa"
            app={appNoParams}
            submitAnalysis={submitAnalysis}
        />
    );
};

export default { title: "Apps / Launch" };
