const DeprecatedParamsApp = {
    description: "An app to test deprecated params.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Hierarchical List Selector app",
    system_id: "de",
    label: "Hierarchical List Selector app",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",
    version: "v1",
    version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b",

    versions: [
        { version: "v2", version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b" },
        { version: "v1", version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b" },
    ],

    groups: [
        {
            id: "d7679d4c-5a86-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Hierarchical Lists",
            parameters: [
                {
                    description: "",
                    arguments: [
                        {
                            isSingleSelect: false,
                            groups: [
                                {
                                    id: "d1eb891e-7eb2-11ea-be2c-008cfa5ae621",
                                    display: "Group 1",
                                    isDefault: false,
                                    arguments: [
                                        {
                                            id: "d1eba322-7eb2-11ea-be2c-008cfa5ae621",
                                            name: "arg3",
                                            value: "val3",
                                            description: "argument 3",
                                            display: "Argument3",
                                            isDefault: false,
                                        },
                                        {
                                            id: "d1ebbfb0-7eb2-11ea-be2c-008cfa5ae621",
                                            name: "arg4",
                                            value: "val4",
                                            description: "argument 4",
                                            display: "Argument4",
                                            isDefault: false,
                                        },
                                    ],
                                    groups: [
                                        {
                                            id: "d1ebd8c4-7eb2-11ea-be2c-008cfa5ae621",
                                            display: "Group 2",
                                            isDefault: false,
                                            arguments: [
                                                {
                                                    id: "d1ebf336-7eb2-11ea-be2c-008cfa5ae621",
                                                    name: "arg5",
                                                    value: "val5",
                                                    description: "argument 5",
                                                    display: "Argument5",
                                                    isDefault: false,
                                                },
                                                {
                                                    id: "d1ec0bc8-7eb2-11ea-be2c-008cfa5ae621",
                                                    name: "arg6",
                                                    value: "val6",
                                                    description: "argument 6",
                                                    display: "Argument6",
                                                    isDefault: false,
                                                },
                                            ],
                                            groups: [],
                                        },
                                    ],
                                },
                                {
                                    id: "d1ec228e-7eb2-11ea-be2c-008cfa5ae621",
                                    display: "Group 3",
                                    isDefault: false,
                                    arguments: [
                                        {
                                            id: "d1ec3b34-7eb2-11ea-be2c-008cfa5ae621",
                                            name: "arg7",
                                            value: "val7",
                                            description: "argument 7",
                                            display: "Argument7",
                                            isDefault: false,
                                        },
                                    ],
                                    groups: [],
                                },
                            ],
                            selectionCascade: "CHILDREN",
                            arguments: [
                                {
                                    id: "d1eb5246-7eb2-11ea-be2c-008cfa5ae621",
                                    name: "arg1",
                                    value: "val1",
                                    description: "a top-level argument",
                                    display: "Top-lvl arg",
                                    isDefault: false,
                                },
                                {
                                    id: "d1eb6f56-7eb2-11ea-be2c-008cfa5ae621",
                                    name: "arg2",
                                    value: "val2",
                                    description: "another top-level arg",
                                    display: "Top-lvl arg2",
                                    isDefault: false,
                                },
                            ],
                            id: "d1eb3612-7eb2-11ea-be2c-008cfa5ae621",
                        },
                    ],
                    name: "",
                    type: "TreeSelection",
                    validators: [],
                    label: "List Tree",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d1eb0b24-7eb2-11ea-be2c-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default DeprecatedParamsApp;
