const WordCountApp = {
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
    version: "v2",
    version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b",

    versions: [
        { version: "v2", version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b" },
        { version: "v1", version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b" },
    ],

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
                    id: "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 0,
        },
    ],
};

export default WordCountApp;
