const NumberParamsApp = {
    description: "Integer and Double number parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Number params",
    system_id: "de",
    label: "Number params",
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
                    id: "ddf03cb0-5751-11ea-b2f6-008cfa5ae621_ddf1a172-5751-11ea-b2f6-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "Enter a number between 3 and 7",
                    arguments: [],
                    name: "--int",
                    type: "Integer",
                    validators: [
                        {
                            type: "IntRange",
                            params: [3, 7],
                        },
                        {
                            type: "IntAbove",
                            params: [1],
                        },
                        {
                            type: "IntBelow",
                            params: [10],
                        },
                    ],
                    label: "Integer with validations",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_58d5fa32-5a86-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    required: true,
                },
                {
                    description: "Enter a number between 0.01 and 10.9",
                    arguments: [],
                    name: "-d",
                    type: "Double",
                    validators: [
                        {
                            type: "DoubleRange",
                            params: [0.01, 10.9],
                        },
                        {
                            type: "DoubleAbove",
                            params: [0],
                        },
                        {
                            type: "DoubleBelow",
                            params: [11],
                        },
                    ],
                    label: "Decimal with validation",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_a54462d2-5a86-11ea-9e38-008cfa5ae621",
                    isVisible: true,
                    defaultValue: "1.23",
                    required: true,
                },
            ],
            step_number: 0,
        },
    ],
};

export default NumberParamsApp;
