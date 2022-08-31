export const instantLaunchMapping = {
    id: "1d9dc7e8-5b5b-11eb-a110-62d47aced14b",
    version: "1",
    mapping: {
        PythonFilesGlob: {
            pattern: "*.py",
            kind: "glob",
            default: {
                id: "44ac42d4-5b5a-11eb-a110-62d47aced14b",
                quick_launch_id: "a4b1f851-80c0-415d-ba3c-6663432e4f7e",
                added_by: "6be9d7fe-854a-11e4-b1aa-bb594900dd6f",
                added_on: "2021-01-20T13:01:22.22495Z",
            },
            compatible: [],
        },
        PythonFilesInfoType: {
            pattern: "python",
            kind: "infoType",
            default: {
                id: "44ac42d4-5b5a-11eb-a110-62d47aced14b",
                quick_launch_id: "a4b1f851-80c0-415d-ba3c-6663432e4f7e",
                added_by: "6be9d7fe-854a-11e4-b1aa-bb594900dd6f",
                added_on: "2021-01-20T13:01:22.22495Z",
            },
            compatible: [],
        },
    },
};

export const instantLaunchAppInfo = {
    description:
        "Jupyter Lab based on jupyter/datascience-notebook with updated iJab plugin, jupyterlab_irods and SQL ",
    requirements: [
        {
            step_number: 0,
            max_cpu_cores: 16,
            memory_limit: 68719476736,
        },
    ],
    deleted: false,
    disabled: false,
    name: "JupyterLab-with-sql-1.0.9",
    system_id: "de",
    debug: false,
    label: "JupyterLab-with-sql-1.0.9",
    id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
    app_type: "DE",
    groups: [
        {
            id: "d624ca80-e921-11e9-8fe0-008cfa5ae621",
            name: "",
            label: "Parameters",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "Input File",
                    id: "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d625f64e-e921-11e9-8fe0-008cfa5ae621",
                    isVisible: true,
                    required: true,
                },
                {
                    description: "Select the files to process.",
                    arguments: [],
                    name: "",
                    value: {
                        path: [
                            "/iplant/home/wregglej/logs/script-output.log",
                            "/iplant/home/wregglej/logs/script-error.log",
                            "/iplant/home/wregglej/logs/recurisive_avu_queries.txt",
                            "/iplant/home/wregglej/logs/gitignore_global.txt",
                        ],
                    },
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Input files",
                    id: "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        path: [
                            "/iplant/home/wregglej/logs/script-output.log",
                            "/iplant/home/wregglej/logs/script-error.log",
                            "/iplant/home/wregglej/logs/recurisive_avu_queries.txt",
                            "/iplant/home/wregglej/logs/gitignore_global.txt",
                        ],
                    },
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export const instantLaunchSavedLaunch = {
    id: "a4b1f851-80c0-415d-ba3c-6663432e4f7e",
    name: "wregglej-test-2",
    description: "",
    creator: "wregglej@iplantcollaborative.org",
    app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
    is_public: false,
    submission: {
        config: {
            "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                [
                    "/iplant/home/wregglej/logs/script-output.log",
                    "/iplant/home/wregglej/logs/script-error.log",
                    "/iplant/home/wregglej/logs/recurisive_avu_queries.txt",
                    "/iplant/home/wregglej/logs/gitignore_global.txt",
                ],
        },
        name: "JupyterLab-with-sql-1.0.9_analysis1",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        system_id: "de",
        debug: false,
        output_dir: "/iplant/home/wregglej/analyses_qa",
        notify: true,
    },
};

export const instantLaunchGlobalSavedLaunches = [
    {
        id: "9d016298-5150-447b-8bfe-29af368ac3f9",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        quick_launch_id: "a4b1f851-80c0-415d-ba3c-6663432e4f7e",
    },
];

export const instantLaunchSubmissionResponse = {
    id: "lol",
    name: "more lol",
    state: "Submitted",
    "start-date": "now",
};

export const usageSummaryResponse = {
    cpu_usage: {
        id: "daafc764-42bf-425d-83c6-dbdfed410e26",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: "1919.5484124900004782",
        effective_start: "2022-03-01T08:38:11.717336Z",
        effective_end: "2023-03-01T08:38:11.717336Z",
        last_modified: "2022-08-16T15:29:50.757566Z",
    },
    data_usage: {
        id: "580cbce3-c94f-4f7e-90de-f073d9088b89",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: 12612182209,
        time: "2022-08-16T15:33:38.352429-07:00",
        last_modified: "2022-08-16T15:33:38.348854-07:00",
    },
    user_plan: {
        id: "3ae507e4-07d5-11ed-b0ae-008cfa5ae621",
        effective_start_date: "2022-07-19T19:39:51.58586-07:00",
        effective_end_date: "2023-07-19T19:39:51.58586-07:00",
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
        quotas: [
            {
                id: "3ae561c6-07d5-11ed-b0ae-008cfa5ae621",
                quota: 2000,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "cpu.hours",
                    description: "",
                },
            },
            {
                id: "3ae56e78-07d5-11ed-b0ae-008cfa5ae621",
                quota: 3298534883328,
                resource_type: {
                    id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "data.size",
                    description: "",
                },
            },
        ],
        users: {
            id: "",
            username: "",
        },
    },
    errors: [],
};

export const usageSummaryStorageLimitExceededResponse = {
    cpu_usage: {
        id: "daafc764-42bf-425d-83c6-dbdfed410e26",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: "1919.5484124900004782",
        effective_start: "2022-03-01T08:38:11.717336Z",
        effective_end: "2023-03-01T08:38:11.717336Z",
        last_modified: "2022-08-16T15:29:50.757566Z",
    },
    data_usage: {
        id: "580cbce3-c94f-4f7e-90de-f073d9088b89",
        user_id: "2ec78d4e-0dc3-11e8-a42f-008cfa5ae621",
        username: "ipcdev@iplantcollaborative.org",
        total: 1261218220900000,
        time: "2022-08-16T15:33:38.352429-07:00",
        last_modified: "2022-08-16T15:33:38.348854-07:00",
    },
    user_plan: {
        id: "3ae507e4-07d5-11ed-b0ae-008cfa5ae621",
        effective_start_date: "2022-07-19T19:39:51.58586-07:00",
        effective_end_date: "2023-07-19T19:39:51.58586-07:00",
        plan: {
            id: "cdf7ac7a-98dc-11ec-bbe3-406c8f3e9cbb",
            name: "Pro",
            description: "Professional plan",
        },
        quotas: [
            {
                id: "3ae561c6-07d5-11ed-b0ae-008cfa5ae621",
                quota: 2000,
                resource_type: {
                    id: "99e3bc7e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "cpu.hours",
                    description: "",
                },
            },
            {
                id: "3ae56e78-07d5-11ed-b0ae-008cfa5ae621",
                quota: 3298534883328,
                resource_type: {
                    id: "99e3f91e-950a-11ec-84a4-406c8f3e9cbb",
                    name: "data.size",
                    description: "",
                },
            },
        ],
        users: {
            id: "",
            username: "",
        },
    },
    errors: [],
};
