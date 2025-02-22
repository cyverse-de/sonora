const FlagParamsApp = {
    description: "Tests variations of flag parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Flag params",
    system_id: "de",
    label: "Flag params",
    id: "ddef9b02-5751-11ea-b2f6-008cfa5ae621",
    app_type: "DE",

    groups: [
        {
            id: "ddf164b4-5751-11ea-b2f6-008cfa5ae621",
            name: "",
            label: "Flag inputs",
            parameters: [
                {
                    description: "--checked t/f",
                    arguments: [],
                    name: "--checked true, --checked false",
                    type: "Flag",
                    validators: [],
                    label: "Checkbox",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_813057d0-5a85-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "true",
                    required: false,
                },
                {
                    description: "--checked or --unchecked",
                    arguments: [],
                    name: "--checked, --unchecked",
                    type: "Flag",
                    validators: [],
                    label: "Checkbox args without values",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_931784bc-5a91-11ea-bde0-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "true",
                    required: false,
                },
                {
                    description:
                        "only passes a command line argument if checked",
                    arguments: [],
                    name: "--checked-only was checked, ",
                    type: "Flag",
                    validators: [],
                    label: "Checkbox checked arg only",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d022466c-5a91-11ea-bcab-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "true",
                    required: false,
                },
                {
                    description:
                        "only passes a command line argument if unchecked",
                    arguments: [],
                    name: ", --unchecked-only was unchecked",
                    type: "Flag",
                    validators: [],
                    label: "Checkbox unchecked arg only",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_eddfb202-5a91-11ea-bcab-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "false",
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default FlagParamsApp;
