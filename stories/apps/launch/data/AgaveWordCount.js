const AgaveWordCount = {
    integration_date: "2018-06-19T20:09:42.000Z",
    description: "[no description provided]",
    deleted: false,
    disabled: false,
    name: "Word Count DE-2 0.0.3",
    system_id: "agave",
    label: "Word Count DE-2 0.0.3",
    id: "word-count-de-2-0.0.3",
    edited_date: "2018-06-19T20:09:42.000Z",
    app_type: "External",

    groups: [
        {
            id: "Inputs",
            name: "Inputs",
            label: "Inputs",
            parameters: [
                {
                    description: "File to count words in.",
                    arguments: [],
                    name: "wcInput",
                    type: "FileFolderInput",
                    validators: [],
                    label: "Input File",
                    id: "wcInput",
                    order: 0,
                    isVisible: true,
                    defaultValue: "",
                    required: true,
                },
            ],
            step_number: 1,
        },
    ],
};

export default AgaveWordCount;
