export const workflowDescription = {
    system_id: "de",
    id: "5b3866b2-b42a-11eb-acda-008cfa5ae621",
    name: "Simple Pipeline",
    description: "A simple pipeline with 2 steps.",
    steps: [
        {
            name: "Concatenate Multiple Files",
            description:
                "Joins two or more files together head to tail using latest Dockerized version of cat.",
            system_id: "de",
            task_id: "77834682-084a-11e8-a871-008cfa5ae621",
            app_type: "DE",
        },
        {
            name: "DE Word Count",
            description: "Counts the number of words in a file",
            system_id: "de",
            task_id: "1ac31629-231a-4090-b3b4-63ee078a0c37",
            app_type: "DE",
        },
    ],
    tasks: [
        {
            system_id: "de",
            id: "77834682-084a-11e8-a871-008cfa5ae621",
            name: "Concatenate Multiple Files",
            description:
                "Joins two or more files together head to tail using latest Dockerized version of cat.",
            tool: {
                description: "A dockerized version of the cat utility.",
                permission: "",
                interactive: false,
                name: "cat",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "c42bdee0-c331-11e6-9d1d-008cfa5ae621",
                container: {
                    network_mode: "none",
                    entrypoint: "cat",
                    id: "c4330d00-c331-11e6-9d1d-008cfa5ae621",
                    image: {
                        name: "discoenv/url-import",
                        id: "15959300-b972-4571-ace2-081af0909599",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                        deprecated: false,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                attribution: "BusyBox",
                version: "1.24.1",
                location: " ",
                implementation: {
                    implementor: "Sarah Roberts",
                    implementor_email: "sarahr@cyverse.org",
                    test: { input_files: ["", ""], output_files: [] },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "7787c306-084a-11e8-a871-008cfa5ae621",
                    name: " ",
                    description:
                        "Select files in the order you wish them to be joined, head-to-tail.",
                    label: "Input Files",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [
                {
                    id: "778b9b16-084a-11e8-a871-008cfa5ae621",
                    name: "",
                    description: "",
                    label: "concatenate_out.txt",
                    format: "Unspecified",
                    required: true,
                },
            ],
        },
        {
            system_id: "de",
            id: "1ac31629-231a-4090-b3b4-63ee078a0c37",
            name: "DE Word Count",
            description: "Counts the number of words in a file",
            tool: {
                description: "Word Count",
                permission: "",
                interactive: false,
                name: "wc",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "85cf7a33-386b-46fe-87c7-8c9d59972624",
                container: {
                    container_volumes_from: [
                        {
                            name_prefix: "wc-data",
                            name: "discoenv/url-import",
                            deprecated: false,
                            url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                            id: "dc9ebf24-5bb8-11e5-b0d5-23f27069e639",
                            read_only: true,
                            osg_image_path: null,
                            tag: "latest",
                        },
                    ],
                    network_mode: "none",
                    entrypoint: "wc",
                    id: "16f52050-3ac6-11e5-90b9-475ce27d079e",
                    image: {
                        name: "discoenv/url-import",
                        id: "15959300-b972-4571-ace2-081af0909599",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                        deprecated: false,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                version: "0.0.1",
                location: "",
                implementation: {
                    implementor: "Default DE Tools",
                    implementor_email: "support@iplantcollaborative.org",
                    test: { input_files: [], output_files: [] },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "13914010-89cd-406d-99c3-9c4ff8b023c3",
                    name: "",
                    description: "The file to count words in.",
                    label: "Input Filename",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [],
        },
    ],
    mappings: [
        {
            source_step: 0,
            target_step: 1,
            map: {
                "13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "778b9b16-084a-11e8-a871-008cfa5ae621",
            },
        },
    ],
};

export const wordCountTasksMock = {
    id: "67d15627-22c5-42bd-8daf-9af5deecceab",
    name: "DE Word Count",
    description: "Counts the number of words in a file",
    system_id: "de",
    tasks: [
        {
            system_id: "de",
            id: "1ac31629-231a-4090-b3b4-63ee078a0c37",
            name: "DE Word Count",
            description: "Counts the number of words in a file",
            tool: {
                description: "Word Count",
                permission: "read",
                interactive: false,
                name: "wc",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "85cf7a33-386b-46fe-87c7-8c9d59972624",
                container: {
                    container_volumes_from: [
                        {
                            name_prefix: "wc-data",
                            name: "discoenv/url-import",
                            deprecated: false,
                            url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                            id: "dc9ebf24-5bb8-11e5-b0d5-23f27069e639",
                            read_only: true,
                            osg_image_path: null,
                            tag: "latest",
                        },
                    ],
                    network_mode: "none",
                    entrypoint: "wc",
                    id: "16f52050-3ac6-11e5-90b9-475ce27d079e",
                    image: {
                        name: "discoenv/url-import",
                        id: "15959300-b972-4571-ace2-081af0909599",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                        deprecated: false,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                version: "0.0.1",
                location: "",
                implementation: {
                    implementor: "Default DE Tools",
                    implementor_email: "support@iplantcollaborative.org",
                    test: {
                        input_files: [],
                        output_files: [],
                    },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "13914010-89cd-406d-99c3-9c4ff8b023c3",
                    name: "",
                    description: "The file to count words in.",
                    label: "Input Filename",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [],
        },
    ],
};

export const concatTasksMock = {
    id: "77830f32-084a-11e8-a871-008cfa5ae621",
    name: "Concatenate Multiple Files",
    description:
        "Joins two or more files together head to tail using latest Dockerized version of cat.",
    system_id: "de",
    tasks: [
        {
            system_id: "de",
            id: "77834682-084a-11e8-a871-008cfa5ae621",
            name: "Concatenate Multiple Files",
            description:
                "Joins two or more files together head to tail using latest Dockerized version of cat.",
            tool: {
                description: "A dockerized version of the cat utility.",
                permission: "read",
                interactive: false,
                name: "cat",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "c42bdee0-c331-11e6-9d1d-008cfa5ae621",
                container: {
                    network_mode: "none",
                    entrypoint: "cat",
                    id: "c4330d00-c331-11e6-9d1d-008cfa5ae621",
                    image: {
                        name: "discoenv/url-import",
                        id: "15959300-b972-4571-ace2-081af0909599",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/url-import/",
                        deprecated: false,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                attribution: "BusyBox",
                version: "1.24.1",
                location: " ",
                implementation: {
                    implementor: "Sarah Roberts",
                    implementor_email: "sarahr@cyverse.org",
                    test: {
                        input_files: ["", ""],
                        output_files: [],
                    },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "7787c306-084a-11e8-a871-008cfa5ae621",
                    name: " ",
                    description:
                        "Select files in the order you wish them to be joined, head-to-tail.",
                    label: "Input Files",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [
                {
                    id: "778b9b16-084a-11e8-a871-008cfa5ae621",
                    name: "",
                    description: "",
                    label: "concatenate_out.txt",
                    format: "Unspecified",
                    required: true,
                },
            ],
        },
    ],
};
