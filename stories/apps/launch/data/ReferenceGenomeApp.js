const ReferenceGenomeApp = {
    description:
        "An app with Reference Genome / Sequence / Annotation parameters.",

    requirements: [
        {
            step_number: 0,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Reference Genome params",
    system_id: "de",
    label: "Reference Genome params",
    id: "1778b1d6-5a83-11ea-9e38-008cfa5ae621",
    app_type: "DE",

    groups: [
        {
            id: "d129ebce-5ce3-11ea-aa6d-008cfa5ae621",
            name: "",
            label: "Reference Genome / Sequence / Annotation",
            parameters: [
                {
                    description: "All the Genomes",
                    arguments: [],
                    name: "--ref-genome",
                    type: "ReferenceGenome",
                    validators: [],
                    label: "Reference Genome",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12a1af4-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: true,
                },
                {
                    description: "Just a Sequence",
                    arguments: [],
                    name: "--ref-seq",
                    type: "ReferenceSequence",
                    validators: [],
                    label: "Reference Sequence",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12a9a88-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "Only Annotations",
                    arguments: [],
                    name: "--ref-annotation",
                    type: "ReferenceAnnotation",
                    validators: [],
                    label: "Reference Annotation",
                    id: "17794ff6-5a83-11ea-9e38-008cfa5ae621_d12b1f1c-5ce3-11ea-aa6d-008cfa5ae621",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};

export default ReferenceGenomeApp;
