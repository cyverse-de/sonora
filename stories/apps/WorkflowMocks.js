export const concatTasksMock = {
    id: "77830f32-084a-11e8-a871-008cfa5ae621",
    name: "Concatenate Multiple Files",
    description:
        "Joins two or more files together head to tail using latest Dockerized version of cat.",
    system_id: "de",
    version: "Unversioned",
    version_id: "77830f32-084a-11e8-a871-008cfa5ae621",
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
    ],
};

export const wordCountTasksMock = {
    id: "67d15627-22c5-42bd-8daf-9af5deecceab",
    name: "DE Word Count",
    description: "Counts the number of words in a file",
    system_id: "de",
    version: "Unversioned",
    version_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
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
};

export const workflowDescription = {
    id: "5b3866b2-b42a-11eb-acda-008cfa5ae621",
    system_id: "de",
    name: "Simple Pipeline",
    description: "A simple pipeline with 2 steps.",
    version: "v1",
    version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b",
    versions: [
        { version: "v1", version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b" },
        { version: "v2", version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b" },
    ],
    steps: [
        {
            name: concatTasksMock.name,
            description: concatTasksMock.description,
            system_id: concatTasksMock.system_id,
            task_id: concatTasksMock.tasks[0].id,
            app_type: "DE",
        },
        {
            name: wordCountTasksMock.name,
            description: wordCountTasksMock.description,
            system_id: wordCountTasksMock.system_id,
            task_id: wordCountTasksMock.tasks[0].id,
            app_type: "DE",
        },
    ],
    tasks: [concatTasksMock.tasks[0], wordCountTasksMock.tasks[0]],
    mappings: [
        {
            source_step: 0,
            target_step: 1,
            map: {
                [wordCountTasksMock.tasks[0].inputs[0].id]:
                    concatTasksMock.tasks[0].outputs[0].id,
            },
        },
    ],
};

export const deprecatedWordCountTasksMock = {
    id: "c7f05682-23c8-4182-b9a2-e09650a5f49b",
    name: "Word Count",
    description:
        "Counts and summarizes the number of lines, words, and bytes in a target file",
    system_id: "de",
    version: "Unversioned",
    version_id: "c7f05682-23c8-4182-b9a2-e09650a5f49b",
    tasks: [
        {
            system_id: "de",
            id: "c7f05682-23c8-4182-b9a2-e09650a5f49b",
            name: "Word Count",
            description:
                "Counts and summarizes the number of lines, words, and bytes in a target file",
            tool: {
                description: "Word Count",
                permission: "read",
                interactive: false,
                name: "wc_wrapper.sh",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "66faba38-854a-11e4-8e65-27494ee7769e",
                container: {
                    container_volumes: [
                        {
                            host_path: "/data2/",
                            container_path: "/data2/",
                            id: "bde016ea-1c70-11e6-8c28-008cfa5ae621",
                        },
                        {
                            host_path: "/usr/local2/",
                            container_path: "/usr/local2/",
                            id: "bde01b90-1c70-11e6-8c28-008cfa5ae621",
                        },
                        {
                            host_path: "/usr/local3/",
                            container_path: "/usr/local3/",
                            id: "bde01992-1c70-11e6-8c28-008cfa5ae621",
                        },
                    ],
                    id: "16fd2a16-3ac6-11e5-a25d-2fa4b0893ef1",
                    image: {
                        name: "docker.cyverse.org/backwards-compat",
                        id: "fc210a84-f7cd-4067-939c-a68ec3e3bd2b",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/backwards-compat",
                        deprecated: true,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                attribution:
                    "Wrapper for GNU wc. iPlant DE version developed by Matt Vaughn (vaughn at iplantcollaborative dot org).",
                version: "1.00",
                location: "/usr/local3/bin/wc_tool-1.00",
                implementation: {
                    implementor: "No name",
                    implementor_email: "noreply@iplantcollaborative.org",
                    test: {
                        input_files: [],
                        output_files: [],
                    },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "2f58fce9-8183-4ab5-97c4-970592d1c35a",
                    name: "",
                    description: "Select file to analyze.",
                    label: "Select an input file",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [
                {
                    id: "e7721c78-56c9-41ac-8ff5-8d46093f1fb1",
                    name: "",
                    description: "",
                    label: "wc_out.txt",
                    format: "Unspecified",
                    required: true,
                },
            ],
        },
    ],
};

export const deprecatedConcatTasksMock = {
    id: "af334df2-ad6e-4bf4-b7e8-5686525b63b0",
    name: "Concatenate 2 Files-workflow edition.",
    description:
        "Concatenate multiple files. Compatible with Workflows in the DE.",
    system_id: "de",
    version: "Unversioned",
    version_id: "af334df2-ad6e-4bf4-b7e8-5686525b63b0",
    tasks: [
        {
            system_id: "de",
            id: "af334df2-ad6e-4bf4-b7e8-5686525b63b0",
            name: "Concatenate 2 Files-workflow edition.",
            description:
                "Concatenate multiple files. Compatible with Workflows in the DE.",
            tool: {
                description: "cat 2 files",
                permission: "read",
                interactive: false,
                name: "cat2files.sh",
                type: "executable",
                restricted: false,
                is_public: true,
                id: "87207a09-0b9e-4436-b3ae-a17017069cd7",
                container: {
                    container_volumes: [
                        {
                            host_path: "/data2/",
                            container_path: "/data2/",
                            id: "be78efaa-1c70-11e6-8c28-008cfa5ae621",
                        },
                        {
                            host_path: "/usr/local2/",
                            container_path: "/usr/local2/",
                            id: "be78f414-1c70-11e6-8c28-008cfa5ae621",
                        },
                        {
                            host_path: "/usr/local3/",
                            container_path: "/usr/local3/",
                            id: "be78f234-1c70-11e6-8c28-008cfa5ae621",
                        },
                    ],
                    id: "1700c39c-3ac6-11e5-b842-6b77c1ae7a4d",
                    image: {
                        name: "docker.cyverse.org/backwards-compat",
                        id: "fc210a84-f7cd-4067-939c-a68ec3e3bd2b",
                        tag: "latest",
                        url: "https://registry.hub.docker.com/u/discoenv/backwards-compat",
                        deprecated: true,
                        osg_image_path: null,
                    },
                    skip_tmp_mount: false,
                },
                attribution: "rogerab",
                version: "0.1",
                location: "/usr/local2/rogerab",
                implementation: {
                    implementor: "rogerab",
                    implementor_email: "rogerab@email.arizona.edu",
                    test: {
                        input_files: [],
                        output_files: [],
                    },
                },
                time_limit_seconds: 0,
            },
            inputs: [
                {
                    id: "f744f05b-e8d4-4428-84e9-934431c304af",
                    name: "",
                    description: "Enter the first file here.",
                    label: "First File",
                    format: "Unspecified",
                    required: true,
                },
                {
                    id: "e7172252-3727-4807-b1f6-cddf04c80c5e",
                    name: "",
                    description: "Enter the second file here.",
                    label: "Second File",
                    format: "Unspecified",
                    required: true,
                },
            ],
            outputs: [
                {
                    id: "14a78d0a-21f1-428c-9279-d803043ae99d",
                    name: "",
                    description: "Give a name to your output file.",
                    label: "concatentate_out.txt",
                    format: "Unspecified",
                    required: true,
                },
            ],
        },
    ],
};

export const deprecatedToolsWorkflowDescription = {
    id: "4b8214a0-254f-45dc-ba6a-0587a7228b5c",
    system_id: "de",
    name: "test deprecated tools pipeline",
    description: "testing deprecated tools",
    version: "v1",
    version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b",
    versions: [
        { version: "v1", version_id: "8a1e3b3c-0d34-11ed-8b77-62d47aced14b" },
        { version: "v2", version_id: "b9e1e332-0d34-11ed-ab8a-62d47aced14b" },
    ],
    steps: [
        {
            name: deprecatedWordCountTasksMock.name,
            description: deprecatedWordCountTasksMock.description,
            system_id: deprecatedWordCountTasksMock.system_id,
            task_id: deprecatedWordCountTasksMock.tasks[0].id,
            app_type: "DE",
        },
        {
            name: deprecatedConcatTasksMock.name,
            description: deprecatedConcatTasksMock.description,
            system_id: deprecatedConcatTasksMock.system_id,
            task_id: deprecatedConcatTasksMock.tasks[0].id,
            app_type: "DE",
        },
    ],
    tasks: [
        deprecatedWordCountTasksMock.tasks[0],
        deprecatedConcatTasksMock.tasks[0],
    ],
    mappings: [
        {
            source_step: 0,
            target_step: 1,
            map: {
                [deprecatedConcatTasksMock.tasks[0].inputs[1].id]:
                    deprecatedWordCountTasksMock.tasks[0].outputs[0].id,
            },
        },
    ],
};
