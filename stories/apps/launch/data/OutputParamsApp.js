const OutputParamsApp = {
    description: "File, folder, and multi-output parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Output params",
    system_id: "de",
    label: "Output params",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",

    groups: [
        {
            id: "59f5c03c-5ce3-11ea-aa6d-008cfa5ae621",
            name: "",
            label: "Output",
            parameters: [
                {
                    description: "Name the output file",
                    arguments: [],
                    name: "--out",
                    type: "FileOutput",
                    validators: [],
                    label: "Output File by tool",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_59f5f372-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "tool.out",
                    required: true,
                },
                {
                    description: "Name the output folder",
                    arguments: [],
                    name: "--folder-out",
                    type: "FolderOutput",
                    validators: [],
                    label: "Output Folder",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d128d8a6-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "outputs",
                    required: false,
                },
                {
                    description:
                        "Any Unix-style glob that does not start with / or contain ../",
                    arguments: [],
                    name: "--multi-out",
                    type: "MultiFileOutput",
                    validators: [],
                    label: "Multi-file Output",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d129746e-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "*.txt",
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default OutputParamsApp;
