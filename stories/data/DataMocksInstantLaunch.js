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

export const instantLaunchQuickLaunch = {
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

export const instantLaunchGlobalQuickLaunches = [
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
