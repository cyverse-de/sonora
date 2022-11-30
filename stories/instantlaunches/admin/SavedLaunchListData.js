export const testData = [
    {
        id: "2421c19e-ad85-4217-a21f-e0832f824171",
        name: "sample-savedlaunch",
        description: "",
        creator: "ipcdev@iplantcollaborative.org",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "34f34466-9a8a-11e8-9c8e-008cfa5ae621_34f89a92-9a8a-11e8-9c8e-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplant_training/read_cleanup/sampledata/frag_1.fastq",
                        "/iplant/home/shared/iplant_training/read_cleanup/sampledata/frag_2.fastq",
                        "/iplant/home/shared/iplant_training/read_cleanup/sampledata/illumina_adapters.fa",
                    ],
            },
            name: "JupyterLab-0.0.3_analysis1",
            app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/ipcdev/analyses",
            notify: true,
        },
    },
    {
        id: "3f8cd42a-ee04-42de-872d-1bd637a77ddc",
        name: "test",
        description: "",
        creator: "aramsey@iplantcollaborative.org",
        app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "e54cc5c8-f811-11e8-8a14-008cfa5ae621_e5559568-f811-11e8-8a14-008cfa5ae621":
                    [],
            },
            name: "JupJup_analysis1",
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/aramsey/analyses",
            notify: true,
        },
    },
    {
        id: "f0d5c20a-d960-44e3-b9ee-dd1c85e75b69",
        name: "instant-launch-test",
        description: "",
        creator: "wregglej@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [],
            },
            name: "jupyter-lab-instant-launch",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/wregglej/analyses_qa",
            notify: true,
        },
    },
    {
        id: "d5f53129-f0af-490a-8221-e76440203cdc",
        name: "instant-launch-test-1",
        description: "",
        creator: "wregglej@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [],
            },
            name: "jupyter-lab-instant-launch-1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/wregglej/analyses_qa",
            notify: true,
        },
    },
    {
        id: "8ebc6c80-2058-4953-b4c9-ecf893deae03",
        name: "instant-launch-test-2",
        description: "",
        creator: "wregglej@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [],
            },
            name: "jupyter-lab-instant-launch-2",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/wregglej/analyses_qa",
            notify: true,
        },
    },
];

export const testGlobalQLs = [
    {
        id: "1c5459f5-42c9-41f9-a8d8-7b328f60b418",
        quick_launch_id: "2421c19e-ad85-4217-a21f-e0832f824171",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
    },
    {
        id: "6ae67c2a-8153-4575-8425-2cc7526daac5",
        quick_launch_id: "3f8cd42a-ee04-42de-872d-1bd637a77ddc",
        app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
    },
    {
        id: "8d1a04c4-4785-4122-b50b-f0ae3fe7fdc3",
        quick_launch_id: "f0d5c20a-d960-44e3-b9ee-dd1c85e75b69",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
    },
];

export const testInstantLaunches = {
    instant_launches: [
        {
            id: "6ae67c2a-8153-4575-8425-2cc7526daac5",
            quick_launch_id: "3f8cd42a-ee04-42de-872d-1bd637a77ddc",
            added_by: "aramsey@iplantcollaborative.org",
            added_on: Date(),
        },
    ],
};

export const testFullInstantLaunchList = {
    instant_launches: [
        {
            id: "2A05CA56-CC62-406A-AB34-0870F3644E0C",
            quick_launch_id: "2421c19e-ad85-4217-a21f-e0832f824171",
            name: "sample-savedlaunch",
            quick_launch_name: "sample-savedlaunch",
            quick_launch_description: "",
            quick_launch_creator: "ipcdev@iplantcollaborative.org",
            added_by: "ipcdev@siplantcollaborative.org",
            added_on: Date(),
            app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
            app_version_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
            app_version: "v0.0.3",
            app_name: "JupyterLab",
            is_public: true,
            submission: {
                config: {
                    "34f34466-9a8a-11e8-9c8e-008cfa5ae621_34f89a92-9a8a-11e8-9c8e-008cfa5ae621":
                        [
                            "/iplant/home/shared/iplant_training/read_cleanup/sampledata/frag_1.fastq",
                            "/iplant/home/shared/iplant_training/read_cleanup/sampledata/frag_2.fastq",
                            "/iplant/home/shared/iplant_training/read_cleanup/sampledata/illumina_adapters.fa",
                        ],
                },
                name: "JupyterLab-0.0.3_analysis1",
                app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/ipcdev/analyses",
                notify: true,
            },
        },
        {
            id: "F8A85E89-74E3-46AA-9B2C-4265EADD63C2",
            quick_launch_id: "3f8cd42a-ee04-42de-872d-1bd637a77ddc",
            name: "test",
            quick_launch_name: "test",
            quick_launch_description: "",
            quick_launch_creator: "aramsey@iplantcollaborative.org",
            added_by: "aramsey@iplantcollaborative.org",
            added_on: Date(),
            app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
            app_version_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
            app_version: "latest",
            app_name: "JupJup",
            is_public: true,
            submission: {
                config: {
                    "e54cc5c8-f811-11e8-8a14-008cfa5ae621_e5559568-f811-11e8-8a14-008cfa5ae621":
                        [],
                },
                name: "JupJup_analysis1",
                app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/aramsey/analyses",
                notify: true,
            },
        },
        {
            id: "732F73F6-4656-42C1-8EB9-37B0883019F3",
            quick_launch_id: "f0d5c20a-d960-44e3-b9ee-dd1c85e75b69",
            name: "instant-launch-test",
            quick_launch_name: "instant-launch-test",
            quick_launch_description: "",
            quick_launch_creator: "wregglej@iplantcollaborative.org",
            added_by: "wregglej@iplantcollaborative.org",
            added_on: Date(),
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version: "Unversioned",
            app_name: "jupyter-lab",
            is_public: true,
            submission: {
                config: {
                    "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                        [],
                },
                name: "jupyter-lab-instant-launch",
                app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/wregglej/analyses_qa",
                notify: true,
            },
        },
        {
            id: "6B6CBA6F-4468-4E54-AD99-E3AC5E4E08A4",
            quick_launch_id: "d5f53129-f0af-490a-8221-e76440203cdc",
            name: "instant-launch-test-1",
            quick_launch_name: "instant-launch-test-1",
            quick_launch_description: "",
            quick_launch_creator: "wregglej@iplantcollaborative.org",
            added_by: "wregglej@iplantcollaborative.org",
            added_on: Date(),
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version: "Unversioned",
            app_name: "jupyter-lab",
            is_public: true,
            submission: {
                config: {
                    "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                        [],
                },
                name: "jupyter-lab-instant-launch-1",
                app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/wregglej/analyses_qa",
                notify: true,
            },
        },
        {
            id: "0509A78A-0E0A-41F4-A29C-E8E694FA028A",
            quick_launch_id: "8ebc6c80-2058-4953-b4c9-ecf893deae03",
            name: "instant-launch-test-2",
            quick_launch_name: "instant-launch-test-2",
            quick_launch_description: "",
            quick_launch_creator: "wregglej@iplantcollaborative.org",
            added_by: "wregglej@iplantcollaborative.org",
            added_on: Date(),
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            app_version: "Unversioned",
            app_name: "jupyter-lab",
            is_public: true,
            submission: {
                config: {
                    "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                        [],
                },
                name: "jupyter-lab-instant-launch-2",
                app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/wregglej/analyses_qa",
                notify: true,
            },
        },
    ],
};

export const instantLaunchNavDrawerMock = {
    instant_launches: [
        {
            quick_launch_name: "cli",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "b29b7cf2-e4b1-11eb-8726-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            added_on: "2021-09-04T11:03:18.077947Z",
            id: "61f68dd8-0daa-11ec-8519-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "546fcbfb-5146-4d93-a008-e7e898b741e9",
            app_description:
                "Bourne Again Shell (BASH) terminal includes conda",
            submission: {
                description: "",
                requirements: [
                    {
                        min_cpu_cores: 0,
                        min_memory_limit: 0,
                        min_disk_space: 0,
                        step_number: 0,
                    },
                ],
                config: {
                    "b29c2512-e4b1-11eb-8726-008cfa5ae621_7a673a12-e4b4-11eb-a0b9-008cfa5ae621":
                        [],
                },
                name: "Cloud_Shell_analysis1",
                app_id: "b29b7cf2-e4b1-11eb-8726-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Cloud Shell",
        },
    ],
};

export const testInstantLaunchesDashboard = {
    instant_launches: [
        {
            id: "6B6CBA6F-4468-4E54-AD99-E3AC5E4E08A4",
            quick_launch_id: "d5f53129-f0af-490a-8221-e76440203cdc",
            name: "instant-launch-test-1",
            quick_launch_description: "",
            quick_launch_creator: "wregglej@iplantcollaborative.org",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            is_public: true,
            submission: {
                config: {
                    "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                        [],
                },
                name: "jupyter-lab-instant-launch-1",
                app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/wregglej/analyses_qa",
                notify: true,
            },
        },
        {
            id: "0509A78A-0E0A-41F4-A29C-E8E694FA028A",
            quick_launch_id: "8ebc6c80-2058-4953-b4c9-ecf893deae03",
            name: "instant-launch-test-2",
            quick_launch_description: "",
            quick_launch_creator: "wregglej@iplantcollaborative.org",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            is_public: true,
            submission: {
                config: {
                    "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                        [],
                },
                name: "jupyter-lab-instant-launch-2",
                app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
                system_id: "de",
                debug: false,
                output_dir: "/iplant/home/wregglej/analyses_qa",
                notify: true,
            },
        },
    ],
};
