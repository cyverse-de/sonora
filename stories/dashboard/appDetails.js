export const listingById = {
    total: 1,
    apps: [
        {
            integration_date: "2013-05-24T21:44:49.000Z",
            description: "*waves hand* This is the app you're looking for.",
            deleted: false,
            pipeline_eligibility: {
                is_valid: true,
                reason: "",
            },
            is_favorite: true,
            integrator_name: "Obi Wan Kenobi",
            beta: false,
            permission: "read",
            can_favor: true,
            disabled: false,
            can_rate: true,
            name: "The App",
            system_id: "de",
            is_public: true,
            id: "676846d4-854a-11e4-980d-7f0fcca75dbb",
            edited_date: "2013-05-24T20:56:03.000Z",
            step_count: 1,
            can_run: true,
            integrator_email: "obiwan@jedi.org",
            app_type: "de",
            wiki_url:
                "http://pods.iplantcollaborative.org/wiki/display/DEapps/Annotate+transcripts",
            rating: {
                average: 3.0,
                total: 10,
            },
        },
    ],
};

export const appDetails = {
    integration_date: "2013-05-24T21:44:49.000Z",
    description: "*waves hand* This is the app you're looking for.",
    deleted: false,
    integrator_name: "Obi Wan Kenobi",
    disabled: false,
    suggested_categories: [
        {
            id: "f9f22c5a-09f5-4630-997c-4e3a00ae924b",
            name: "Assembly Annotation",
        },
    ],
    hierarchies: [
        {
            iri: "http://edamontology.org/topic_0003",
            label: "Topic",
            subclasses: [
                {
                    iri: "http://edamontology.org/topic_3070",
                    label: "Biology",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/topic_3053",
                            label: "Genetics",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/topic_3321",
                                    label: "Molecular genetics",
                                    subclasses: [
                                        {
                                            iri: "http://edamontology.org/topic_0203",
                                            label: "Gene expression",
                                            subclasses: [
                                                {
                                                    iri: "http://edamontology.org/topic_3308",
                                                    label: "Transcriptomics",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    iri: "http://edamontology.org/topic_3307",
                    label: "Computational biology",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/topic_3321",
                            label: "Molecular genetics",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/topic_0203",
                                    label: "Gene expression",
                                    subclasses: [
                                        {
                                            iri: "http://edamontology.org/topic_3308",
                                            label: "Transcriptomics",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    iri: "http://edamontology.org/topic_3391",
                    label: "Omics",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/topic_0622",
                            label: "Genomics",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/topic_3308",
                                    label: "Transcriptomics",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            iri: "http://edamontology.org/operation_0004",
            label: "Operation",
            subclasses: [
                {
                    iri: "http://edamontology.org/operation_0226",
                    label: "Annotation",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/operation_0361",
                            label: "Sequence annotation",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/operation_3672",
                                    label: "Gene functional annotation",
                                },
                            ],
                        },
                    ],
                },
                {
                    iri: "http://edamontology.org/operation_2428",
                    label: "Validation",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/operation_3180",
                            label: "Sequence assembly validation",
                        },
                    ],
                },
                {
                    iri: "http://edamontology.org/operation_2945",
                    label: "Analysis",
                    subclasses: [
                        {
                            iri: "http://edamontology.org/operation_2403",
                            label: "Sequence analysis",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/operation_2478",
                                    label: "Nucleic acid sequence analysis",
                                    subclasses: [
                                        {
                                            iri: "http://edamontology.org/operation_3180",
                                            label: "Sequence assembly validation",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            iri: "http://edamontology.org/operation_2501",
                            label: "Nucleic acid analysis",
                            subclasses: [
                                {
                                    iri: "http://edamontology.org/operation_2478",
                                    label: "Nucleic acid sequence analysis",
                                    subclasses: [
                                        {
                                            iri: "http://edamontology.org/operation_3180",
                                            label: "Sequence assembly validation",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    name: "The App",
    tools: [
        {
            attribution: "obiwan",
            name: "the_app.pl",
            type: "executable",
            description: "The App",
            id: "66fbef16-854a-11e4-9d48-ab603f97c137",
            location: "/usr/local2/AnnotateTranscripts/annotate_transcripts",
            container: {
                image: {
                    name: "docker.cyverse.org/backwards-compat",
                    tag: "latest",
                    url: "https://registry.hub.docker.com/u/discoenv/backwards-compat",
                    deprecated: true,
                },
            },
            version: "1.0",
        },
    ],
    system_id: "de",
    references: [
        "",
        "http://trinityrnaseq.sourceforge.net/analysis/diff_expression_analysis.html",
    ],
    categories: [
        {
            id: "f9f22c5a-09f5-4630-997c-4e3a00ae924b",
            name: "Assembly Annotation",
        },
    ],
    id: "676846d4-854a-11e4-980d-7f0fcca75dbb",
    edited_date: "2013-05-24T20:56:03.000Z",
    job_stats: {
        job_count_completed: 88,
        job_last_completed: "2018-09-19T19:23:50.000Z",
    },
    integrator_email: "obiwan@jedi.org",
    wiki_url:
        "http://pods.iplantcollaborative.org/wiki/display/DEapps/Annotate+transcripts",
};
