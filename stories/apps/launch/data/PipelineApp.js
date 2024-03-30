import constants from "../../../../src/constants";

const PipelineApp = {
    description: "Example of an app with 2 steps.",

    requirements: [
        {
            max_cpu_cores: 4,
            memory_limit: 8 * constants.ONE_GiB,
            step_number: 0,
        },
        {
            step_number: 1,
        },
    ],

    deleted: false,
    disabled: false,
    name: "2-step workflow",
    system_id: "de",
    label: "2-step workflow",
    id: "4b8214a0-254f-45dc-ba6a-0587a7228b5c",
    app_type: "DE",

    groups: [
        {
            id: "05a2ad8f-c452-4cdb-ad0a-774c879b8868",
            name: "Word Count - ",
            label: "Word Count - Input data",
            parameters: [
                {
                    description: "Select file to analyze.",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "Select an input file",
                    id: "6790a642-854a-11e4-b4c9-27b8156a741a_2f58fce9-8183-4ab5-97c4-970592d1c35a",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 0,
        },
        {
            id: "14019b2f-0ead-4f4b-a3ec-a881cb440b0c",
            name: "Concatenate 2 Files-workflow edition. - ",
            label: "Concatenate 2 Files-workflow edition. - Select input data",
            parameters: [
                {
                    description: "Enter the first file here.",
                    arguments: [],
                    name: "",
                    type: "FileInput",
                    validators: [],
                    label: "First File",
                    id: "6790a76e-854a-11e4-bf11-6f99489b3e09_f744f05b-e8d4-4428-84e9-934431c304af",
                    isVisible: true,
                    required: true,
                },
            ],
            step_number: 1,
        },
        {
            id: "ddbcb9af-75cf-4df9-bc2e-912e5a57df44",
            name: "Concatenate 2 Files-workflow edition. - ",
            label: "Concatenate 2 Files-workflow edition. - Output files",
            parameters: [
                {
                    description: "Give a name to your output file.",
                    arguments: [],
                    name: "",
                    type: "FileOutput",
                    validators: [],
                    label: "concatenate_out.txt",
                    id: "6790a76e-854a-11e4-bf11-6f99489b3e09_14a78d0a-21f1-428c-9279-d803043ae99d",
                    isVisible: true,
                    defaultValue: "concatentate_out.txt",
                    required: true,
                },
            ],
            step_number: 1,
        },
    ],
};

export default PipelineApp;
