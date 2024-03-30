const SelectParamsApp = {
    description: "Variations of list parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "List params",
    system_id: "de",
    label: "List params",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",

    groups: [
        {
            id: "d7679d4c-5a86-11ea-9e38-008cfa5ae621",
            name: "",
            label: "Lists",
            parameters: [
                {
                    description: "required list",
                    arguments: [
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abbe3acc-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 1",
                            value: "val1",
                        },
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abbefbe2-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 2",
                            value: "val2",
                        },
                        {
                            name: "--required-list",
                            isDefault: false,
                            id: "abc0c332-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 3",
                            value: "val3",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Required Text List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_abbde28e-5ce1-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    required: true,
                },
                {
                    description: "not required",
                    arguments: [
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d6f58-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 4",
                            value: "val4",
                        },
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d879a-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 5",
                            value: "val5",
                        },
                        {
                            name: "--optional-list",
                            isDefault: false,
                            id: "e16d9da2-5ce1-11ea-8af3-008cfa5ae621",
                            display: "Value 6",
                            value: "val6",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Optional List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e16d4ad2-5ce1-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "A way to force a visible parameter to always be set.",
                    arguments: [
                        {
                            name: "--list-always",
                            isDefault: true,
                            id: "072d632e-5ce2-11ea-8af3-008cfa5ae621",
                            display: "only option",
                            value: "on",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Forced Option List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_072d3f52-5ce2-11ea-8af3-008cfa5ae621",
                    isVisible: true,
                    defaultValue: {
                        id: "072d632e-5ce2-11ea-8af3-008cfa5ae621",
                        name: "--list-always",
                        value: "on",
                        display: "only option",
                        isDefault: true,
                    },
                    required: true,
                },
                {
                    description:
                        "A list that only allows integer display labels.",
                    arguments: [
                        {
                            name: "--int-list",
                            isDefault: false,
                            id: "e9dde8f6-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1",
                            value: "Value 1",
                        },
                        {
                            name: "--int-list",
                            isDefault: true,
                            id: "e9de035e-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "2",
                            value: "Value 2",
                        },
                        {
                            name: "--int-list",
                            isDefault: false,
                            id: "e9de1a06-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "3",
                            value: "Value 3",
                        },
                    ],
                    name: "",
                    type: "IntegerSelection",
                    validators: [],
                    label: "Integer List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e9ddc376-5ce2-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "A list that only allows decimal display labels.",
                    arguments: [
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de62fe-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.2",
                            value: "Value 1.2",
                        },
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de7c4e-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.3",
                            value: "Value 1.3",
                        },
                        {
                            name: "--decimal-list",
                            isDefault: false,
                            id: "e9de917a-5ce2-11ea-aa6d-008cfa5ae621",
                            display: "1.4",
                            value: "Value 1.4",
                        },
                    ],
                    name: "",
                    type: "DoubleSelection",
                    validators: [],
                    label: "Decimal List",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_e9de4576-5ce2-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default SelectParamsApp;
