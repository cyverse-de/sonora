const InputParamsApp = {
    description: "File, folder, and multi-input parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Input params",
    system_id: "de",
    label: "Input params",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",

    groups: [
        {
            id: "177a671a-5a83-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Input",
            parameters: [
                {
                    description: "not required, excluded if empty",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "Input File",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177aaf4a-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "Select only folders.",
                    arguments: [],
                    name: "",
                    type: "FolderInput",
                    validators: [],
                    label: "Input Folder",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177c4440-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "Select 1 or more files.",
                    arguments: [],
                    name: "--input",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Multiple Input Files",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_177cd7b6-5a83-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default InputParamsApp;
