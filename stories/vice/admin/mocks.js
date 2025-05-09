export const viceRequests = {
    requests: [
        {
            id: "775781fc-1de2-11ed-8008-008cfa5ae621",
            request_type: "vice",
            requesting_user: "torbera",
            details: {
                concurrent_jobs: 2,
                email: "torbera@example.org",
                intended_use:
                    "i need it for class project in order to get credit and do work",
                name: "Torbera Cloudmountain",
            },
            created_date: "2022-08-16T21:10:02.032791Z",
            status: "Submitted",
            updated_date: "2022-08-17T07:54:42.198689Z",
        },
        {
            id: "e4c50fb0-1e1f-11ed-bd01-008cfa5ae621",
            request_type: "vice",
            requesting_user: "andreneia",
            details: {
                concurrent_jobs: 2,
                email: "andreniea@example.org",
                intended_use:
                    "Required for Short Course at ESA/CSEE meeting in Montreal",
                name: "Andreneia Orcsmasher",
            },
            created_date: "2022-08-17T04:29:44.920994Z",
            status: "Submitted",
            updated_date: "2022-08-17T07:54:45.283932Z",
        },
        {
            id: "f9f9dc2e-1e3f-11ed-bd01-008cfa5ae621",
            request_type: "vice",
            requesting_user: "enna",
            details: {
                concurrent_jobs: 2,
                email: "enna@example.org",
                intended_use:
                    "Want to use PatMatch on a duckweed genome to identify specific promoter elements involved in root development. Existing jupyter enviornment is too slow, but the genome is not large (similar to arabidopsis). This this the only task I will be using VICE for.",
                name: "Enna Liadon",
            },
            created_date: "2022-08-17T08:19:24.395286Z",
            status: "Submitted",
            updated_date: "2022-08-17T09:49:51.769556Z",
        },
        {
            id: "9681c91e-1ea2-11ed-962a-008cfa5ae621",
            request_type: "vice",
            requesting_user: "morky",
            details: {
                concurrent_jobs: 2,
                email: "morky@example.org",
                intended_use:
                    "Royal Bao in CHEM 430.002 needs access to VICE apps to complete 4 data exploration activities using python via Jupyter Notebook frameworks",
                name: "Morky Strongshell",
            },
            created_date: "2022-08-17T20:05:17.691034Z",
            status: "Submitted",
            updated_date: "2022-08-18T04:41:37.788957Z",
        },
        {
            id: "e654d662-1ea6-11ed-a730-008cfa5ae621",
            request_type: "vice",
            requesting_user: "cora",
            details: {
                concurrent_jobs: 2,
                email: "cora@example.org",
                intended_use:
                    "Using for Chem 430 course at UNC Chapel Hill. Required to complete assignments using python data analysis.",
                name: "Cora Canderwynn",
            },
            created_date: "2022-08-17T20:36:09.59981Z",
            status: "Submitted",
            updated_date: "2022-08-18T04:41:40.850292Z",
        },
        {
            id: "18e39292-1eea-11ed-8008-008cfa5ae621",
            request_type: "vice",
            requesting_user: "garth",
            details: {
                concurrent_jobs: 2,
                email: "garth@example.org",
                intended_use:
                    "I need to double-check some syntax or perhaps send a test HTTP request to some API with which I'm familiarising myself.",
                name: "Garth Tarki",
            },
            created_date: "2022-08-18T04:37:10.701751Z",
            status: "Submitted",
            updated_date: "2022-08-18T04:41:42.980545Z",
        },
    ],
};

export const viceResources = {
    deployments: [
        {
            group: 1000,
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
            name: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            command: [],
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            port: 8888,
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            image: "cyversevice/jupyterlab-scipy:latest",
            namespace: "vice-apps",
            user: 1000,
        },
        {
            group: 1000,
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
            name: "28655b9a-5959-4157-baf1-2436a83d19e7",
            username: "ipcdev",
            command: [],
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            port: 8888,
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            image: "cyverse/jupyterlab-nanodj:latest",
            namespace: "vice-apps",
            user: 1000,
        },
        {
            group: 1000,
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:07 -0700 MST",
            name: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            username: "ipcdev",
            command: [],
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            port: 8888,
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            image: "gims.cyverse.org:5000/jupyterlab-qiime2:2019.10",
            namespace: "vice-apps",
            user: 1000,
        },
        {
            group: 1000,
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:53 -0700 MST",
            name: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            username: "sriram",
            command: [],
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            port: 8888,
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            image: "sblsdsc/ten-rules-jupyter-vice:1",
            namespace: "vice-apps",
            user: 1000,
        },
        {
            group: 1000,
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "e112629a-67ec-4018-bf28-30b244e940c3",
            username: "psarando",
            command: [],
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            port: 8888,
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            image: "cyversevice/jupyterlab-scipy:gee-latest",
            namespace: "vice-apps",
            user: 1000,
        },
    ],
    pods: [
        {
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
            name: "0f809627-361a-4ab6-97ea-76bf7b6f19a3-6667ffdf8b-vpm9m",
            username: "abwasisi",
            phase: "Running",
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            initContainerStatuses: [
                {
                    ready: true,
                    name: "input-files-init",
                    restartCount: 0,
                    state: {
                        terminated: {
                            exitCode: 0,
                            reason: "Completed",
                            startedAt: "2020-03-26T17:28:43Z",
                            finishedAt: "2020-03-26T17:29:18Z",
                            containerID:
                                "docker://ba0d803eab945fe60ccec3dbb3f07b4d39b61b6105420540d2279294f8dad86e",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://ba0d803eab945fe60ccec3dbb3f07b4d39b61b6105420540d2279294f8dad86e",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
            ],
            containerStatuses: [
                {
                    started: true,
                    ready: true,
                    name: "analysis",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:29:23Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://524d378c7c5ad81ca4534ba8c76cb7132198d0ad9f8c25868b9d84a428a7679d",
                    imageID:
                        "docker-pullable://cyversevice/jupyterlab-scipy@sha256:bd86901f453d698742875d5228c4b2a3db131ac60b1af40e4242d6357fe166a1",
                    image: "cyversevice/jupyterlab-scipy:latest",
                },
                {
                    started: true,
                    ready: true,
                    name: "input-files",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:29:22Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://6b87bbd258976ae33906a8c16b4a8b8e138d17bce27f1d45ccad77aad23bb15f",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
                {
                    started: true,
                    ready: true,
                    name: "vice-proxy",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:29:20Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://c4a4410827da16141b1c2d35476a0004e0ca90ca08030efa02fe19c496df52e7",
                    imageID:
                        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11",
                    image: "discoenv/vice-proxy:qa",
                },
            ],
            reason: "",
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            namespace: "vice-apps",
            message: "",
        },
        {
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
            name: "28655b9a-5959-4157-baf1-2436a83d19e7-58b8445bff-pbnnq",
            username: "ipcdev",
            phase: "Running",
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            initContainerStatuses: [
                {
                    ready: true,
                    name: "input-files-init",
                    restartCount: 0,
                    state: {
                        terminated: {
                            exitCode: 0,
                            reason: "Completed",
                            startedAt: "2020-03-26T17:20:33Z",
                            finishedAt: "2020-03-26T17:20:33Z",
                            containerID:
                                "docker://22ea79f0e29a3739308c432a9a80ce66716618b032a765c87b41eda5ea0220d9",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://22ea79f0e29a3739308c432a9a80ce66716618b032a765c87b41eda5ea0220d9",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
            ],
            containerStatuses: [
                {
                    started: true,
                    ready: true,
                    name: "analysis",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:35:48Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://2c2648e0933249f573ff5de1c1e9ad9636518460473490a78eeff951e7bfaa3c",
                    imageID:
                        "docker-pullable://cyverse/jupyterlab-nanodj@sha256:64aeacf5b84ef2580dc0ed18caeae85066277f7f1df3c712b2dcc95294f83d03",
                    image: "cyverse/jupyterlab-nanodj:latest",
                },
                {
                    started: true,
                    ready: true,
                    name: "input-files",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:20:38Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://f8fc2bdccc7b7caa0aaafa2c9fd4322592ea78adcb6c93468eedfe439daa46a2",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
                {
                    started: true,
                    ready: true,
                    name: "vice-proxy",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-03-26T17:20:36Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://6adf5c71e934160136f51f97ae4143a6513891ccc3c98477d76a45c6d4f3b804",
                    imageID:
                        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11",
                    image: "discoenv/vice-proxy:qa",
                },
            ],
            reason: "",
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            message: "",
        },
        {
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:07 -0700 MST",
            name: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f-59f96fbf88-cjwht",
            username: "ipcdev",
            phase: "Running",
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            initContainerStatuses: [
                {
                    ready: true,
                    name: "input-files-init",
                    restartCount: 0,
                    state: {
                        terminated: {
                            exitCode: 0,
                            reason: "Completed",
                            startedAt: "2020-05-12T18:22:25Z",
                            finishedAt: "2020-05-12T18:22:40Z",
                            containerID:
                                "docker://768f5dadc97ae5afacb137dead3ed01d9a545e7c0428dfa57bc13c208ba270b2",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://768f5dadc97ae5afacb137dead3ed01d9a545e7c0428dfa57bc13c208ba270b2",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:142ebbace0327df6d68f1af42a7edd78482c9f1f1db3f85f678aece044b00a38",
                    image: "discoenv/vice-file-transfers:qa",
                },
            ],
            containerStatuses: [
                {
                    started: true,
                    ready: true,
                    name: "analysis",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-05-12T18:22:46Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://da0ff1083ea0c14b6111c1f945ab8fc4eef3edaac5744af9f3d6189c0d4cafc7",
                    imageID:
                        "docker-pullable://gims.cyverse.org:5000/jupyterlab-qiime2@sha256:cbd698c268d49420ce1a6528df7d7f2eb0c4c429ab8c87396bf2e8f0ba2a21fe",
                    image: "gims.cyverse.org:5000/jupyterlab-qiime2:2019.10",
                },
                {
                    started: true,
                    ready: true,
                    name: "input-files",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-05-12T18:22:44Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://8470899b4c32912b7a3721951edb5f44e32b50ae16bb35cdbd1ae0c7425a437a",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:142ebbace0327df6d68f1af42a7edd78482c9f1f1db3f85f678aece044b00a38",
                    image: "discoenv/vice-file-transfers:qa",
                },
                {
                    started: true,
                    ready: true,
                    name: "vice-proxy",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-05-12T18:22:42Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://d9ade34b9ac7dd60124a39cebdeadd3e2db94bdca981567e8bf7498865e6498c",
                    imageID:
                        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11",
                    image: "discoenv/vice-proxy:qa",
                },
            ],
            reason: "",
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            message: "",
        },
        {
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:54 -0700 MST",
            name: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a-55c6dfbcd6-bdxbk",
            username: "sriram",
            phase: "Running",
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            initContainerStatuses: [
                {
                    ready: true,
                    name: "input-files-init",
                    restartCount: 0,
                    state: {
                        terminated: {
                            exitCode: 0,
                            reason: "Completed",
                            startedAt: "2020-04-30T06:19:57Z",
                            finishedAt: "2020-04-30T06:19:57Z",
                            containerID:
                                "docker://f64dc6ebe6e1b71a426b0b1a9ff5c45d52465bfb32620011a2603f2164f35811",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://f64dc6ebe6e1b71a426b0b1a9ff5c45d52465bfb32620011a2603f2164f35811",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
            ],
            containerStatuses: [
                {
                    started: true,
                    ready: true,
                    name: "analysis",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-04-30T06:20:03Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://1272126c6b0970d426bf7a39ec46116c029ebc28ad4648814b838ef7ec67e181",
                    imageID:
                        "docker-pullable://sblsdsc/ten-rules-jupyter-vice@sha256:897b1a9f19f8a4d433922b216f5966fe83e4ac93bc41616778c6a92e8b50ae01",
                    image: "sblsdsc/ten-rules-jupyter-vice:1",
                },
                {
                    started: true,
                    ready: true,
                    name: "input-files",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-04-30T06:20:01Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://d6028e043d24bf25f9fe5c395ccd00daac4d6f8f729e1ec0641137a964cba2b1",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
                {
                    started: true,
                    ready: true,
                    name: "vice-proxy",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-04-30T06:19:59Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://fc8f1a78c2b52f459ab63861cd7833d16f60366307727fb76eae422f256875d8",
                    imageID:
                        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11",
                    image: "discoenv/vice-proxy:qa",
                },
            ],
            reason: "",
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            namespace: "vice-apps",
            message: "",
        },
        {
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "e112629a-67ec-4018-bf28-30b244e940c3-68bd7b8445-95bsn",
            username: "psarando",
            phase: "Running",
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            initContainerStatuses: [
                {
                    ready: true,
                    name: "input-files-init",
                    restartCount: 0,
                    state: {
                        terminated: {
                            exitCode: 0,
                            reason: "Completed",
                            startedAt: "2020-02-01T01:35:25Z",
                            finishedAt: "2020-02-01T01:35:25Z",
                            containerID:
                                "docker://a56a3877e436410db75d586c5e5d011e211cc1d6db50c0296b6ee93218eee7c1",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://a56a3877e436410db75d586c5e5d011e211cc1d6db50c0296b6ee93218eee7c1",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
            ],
            containerStatuses: [
                {
                    started: true,
                    ready: true,
                    name: "analysis",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-02-01T01:45:42Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://2fa5e6f1429e0893bf1f0a29cefc170276ea9ed94eb3254fa608c8421a8acfee",
                    imageID:
                        "docker-pullable://cyversevice/jupyterlab-scipy@sha256:0d33bdcb49a4bf0785b35f2c8a51ebf3896940d50522db36b3a73155bc46eaf9",
                    image: "cyversevice/jupyterlab-scipy:gee-latest",
                },
                {
                    started: true,
                    ready: true,
                    name: "input-files",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-02-01T01:35:29Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://c1d33627d9916a8e4d0d83ff02c4cb458657b70056c95fb29bdd8e2007411736",
                    imageID:
                        "docker-pullable://discoenv/vice-file-transfers@sha256:21b5b744de853179648902c1fd2a144728bb7dfd790f194c8b4de7af07701e67",
                    image: "discoenv/vice-file-transfers:qa",
                },
                {
                    started: true,
                    ready: true,
                    name: "vice-proxy",
                    restartCount: 0,
                    state: {
                        running: {
                            startedAt: "2020-02-01T01:35:27Z",
                        },
                    },
                    lastState: {},
                    containerID:
                        "docker://6ab00c47768ec1a9fecc4fb386d7c8a88eaff140b205bbea14307496959b5204",
                    imageID:
                        "docker-pullable://discoenv/vice-proxy@sha256:e171184d3e7ac7ac9095b6ac015a1a03dcc157f888801a1cd8526fed4fb22a11",
                    image: "discoenv/vice-proxy:qa",
                },
            ],
            reason: "",
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            namespace: "vice-apps",
            message: "",
        },
    ],
    configMaps: [
        {
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
            name: "excludes-file-0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            namespace: "vice-apps",
            data: {
                "excludes-file": "terrain-intro.ipynb\nlogs\n",
            },
        },
        {
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
            name: "excludes-file-28655b9a-5959-4157-baf1-2436a83d19e7",
            username: "ipcdev",
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            data: {
                "excludes-file": "logs\n",
            },
        },
        {
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:06 -0700 MST",
            name: "excludes-file-2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            username: "ipcdev",
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            data: {
                "excludes-file": "jobservices.yaml\ntest/\nlogs\n",
            },
        },
        {
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:53 -0700 MST",
            name: "excludes-file-3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            username: "sriram",
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            namespace: "vice-apps",
            data: {
                "excludes-file": "logs\n",
            },
        },
        {
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "excludes-file-e112629a-67ec-4018-bf28-30b244e940c3",
            username: "psarando",
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            namespace: "vice-apps",
            data: {
                "excludes-file": "logs\n",
            },
        },
        {
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:39 -0700 MST",
            name: "input-path-list-0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            namespace: "vice-apps",
            data: {
                "input-path-list":
                    "# application/vnd.de.multi-input-path-list+csv; version=1\n/iplant/home/abwasisi/terrain-intro.ipynb\n",
            },
        },
        {
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
            name: "input-path-list-28655b9a-5959-4157-baf1-2436a83d19e7",
            username: "ipcdev",
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            data: {
                "input-path-list": "<nil>",
            },
        },
        {
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:06 -0700 MST",
            name: "input-path-list-2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            username: "ipcdev",
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
            data: {
                "input-path-list":
                    "# application/vnd.de.multi-input-path-list+csv; version=1\n/iplant/home/ipcdev/jobservices.yaml\n/iplant/home/ipcdev/test/\n",
            },
        },
        {
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:53 -0700 MST",
            name: "input-path-list-3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            username: "sriram",
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            namespace: "vice-apps",
            data: {
                "input-path-list": "<nil>",
            },
        },
        {
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "input-path-list-e112629a-67ec-4018-bf28-30b244e940c3",
            username: "psarando",
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            namespace: "vice-apps",
            data: {
                "input-path-list": "<nil>",
            },
        },
    ],
    services: [
        {
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:40 -0700 MST",
            name: "vice-0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            ports: [
                {
                    name: "tcp-input",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-input",
                    port: 60001,
                    protocol: "TCP",
                },
                {
                    name: "tcp-proxy",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-proxy",
                    port: 60000,
                    protocol: "TCP",
                },
            ],
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            namespace: "vice-apps",
        },
        {
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:29 -0700 MST",
            name: "vice-28655b9a-5959-4157-baf1-2436a83d19e7",
            username: "ipcdev",
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            ports: [
                {
                    name: "tcp-input",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-input",
                    port: 60001,
                    protocol: "TCP",
                },
                {
                    name: "tcp-proxy",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-proxy",
                    port: 60000,
                    protocol: "TCP",
                },
            ],
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
        },
        {
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:07 -0700 MST",
            name: "vice-2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            username: "ipcdev",
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            ports: [
                {
                    name: "tcp-input",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-input",
                    port: 60001,
                    protocol: "TCP",
                },
                {
                    name: "tcp-proxy",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-proxy",
                    port: 60000,
                    protocol: "TCP",
                },
            ],
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            namespace: "vice-apps",
        },
        {
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:54 -0700 MST",
            name: "vice-3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            username: "sriram",
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            ports: [
                {
                    name: "tcp-input",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-input",
                    port: 60001,
                    protocol: "TCP",
                },
                {
                    name: "tcp-proxy",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-proxy",
                    port: 60000,
                    protocol: "TCP",
                },
            ],
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            namespace: "vice-apps",
        },
        {
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "vice-e112629a-67ec-4018-bf28-30b244e940c3",
            username: "psarando",
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            ports: [
                {
                    name: "tcp-input",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-input",
                    port: 60001,
                    protocol: "TCP",
                },
                {
                    name: "tcp-proxy",
                    nodePort: 0,
                    targetPort: 0,
                    targetPortName: "tcp-proxy",
                    port: 60000,
                    protocol: "TCP",
                },
            ],
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            namespace: "vice-apps",
        },
    ],
    ingresses: [
        {
            appName: "jupyter-lab-scipy-notebook-latest",
            analysisName: "jupyter-lab-scipy-notebook-latest-analysis",
            creationTimestamp: "2020-03-26 10:28:40 -0700 MST",
            name: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            username: "abwasisi",
            appID: "bc93504c-d584-11e9-8413-008cfa5ae621",
            rules: [
                {
                    host: "a4dc3d5b6",
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName:
                                        "vice-0f809627-361a-4ab6-97ea-76bf7b6f19a3",
                                    servicePort: 60000,
                                },
                            },
                        ],
                    },
                },
            ],
            externalID: "0f809627-361a-4ab6-97ea-76bf7b6f19a3",
            userID: "843c85dc-3629-11ea-93db-008cfa5ae621",
            defaultBackend: "vice-default-backend:80",
            namespace: "vice-apps",
        },
        {
            appName: "copy-of-nanodj",
            analysisName: "copy-of-nanodj-analysis",
            creationTimestamp: "2020-03-26 10:20:30 -0700 MST",
            name: "28655b9a-5959-4157-baf1-2436a83d19e7",
            username: "ipcdev",
            appID: "57712906-d5e7-11e9-869a-008cfa5ae621",
            rules: [
                {
                    host: "ad7309925",
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName:
                                        "vice-28655b9a-5959-4157-baf1-2436a83d19e7",
                                    servicePort: 60000,
                                },
                            },
                        ],
                    },
                },
            ],
            externalID: "28655b9a-5959-4157-baf1-2436a83d19e7",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            defaultBackend: "vice-default-backend:80",
            namespace: "vice-apps",
        },
        {
            appName: "jupyter-lab-qiime2-2019-10",
            analysisName: "jupyter-lab-qiime2-2019-10-analysis",
            creationTimestamp: "2020-05-12 11:22:07 -0700 MST",
            name: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            username: "ipcdev",
            appID: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            rules: [
                {
                    host: "a6a6cca83",
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName:
                                        "vice-2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
                                    servicePort: 60000,
                                },
                            },
                        ],
                    },
                },
            ],
            externalID: "2ef93b9c-c9e9-49fe-9b6b-df16020cfc9f",
            userID: "6c04cd3e-854a-11e4-8fa0-1fbef07e6168",
            defaultBackend: "vice-default-backend:80",
            namespace: "vice-apps",
        },
        {
            appName: "ten-rules-jupyter",
            analysisName: "ten-rules-jupyter-analysis",
            creationTimestamp: "2020-04-29 23:19:54 -0700 MST",
            name: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            username: "sriram",
            appID: "8ec235d8-f173-11e9-a56f-008cfa5ae621",
            rules: [
                {
                    host: "ad23ec17f",
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName:
                                        "vice-3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
                                    servicePort: 60000,
                                },
                            },
                        ],
                    },
                },
            ],
            externalID: "3d9eae42-e3f6-4c9c-a634-bfcb0ab9fb7a",
            userID: "6be9b792-854a-11e4-b877-cb0cf45dbbb0",
            defaultBackend: "vice-default-backend:80",
            namespace: "vice-apps",
        },
        {
            appName: "jupyter-lab-scipy-google-earth-engine",
            analysisName: "jupyter-lab-scipy-google-earth-engine-analysis",
            creationTimestamp: "2020-01-31 18:35:21 -0700 MST",
            name: "e112629a-67ec-4018-bf28-30b244e940c3",
            username: "psarando",
            appID: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            rules: [
                {
                    host: "a350dc00a",
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName:
                                        "vice-e112629a-67ec-4018-bf28-30b244e940c3",
                                    servicePort: 60000,
                                },
                            },
                        ],
                    },
                },
            ],
            externalID: "e112629a-67ec-4018-bf28-30b244e940c3",
            userID: "6bec60d2-854a-11e4-b87e-1f417f9dbc81",
            defaultBackend: "vice-default-backend:80",
            namespace: "vice-apps",
        },
    ],
};

export const instantLaunches = {
    instant_launches: [
        {
            quick_launch_name:
                "JupyterLab Datascience Latest with RStudio & Shiny",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "c222d098-1995-11ed-986c-008cfa5ae621",
            added_on: "2022-08-11T11:10:40.845264Z",
            id: "e8bc4206-19a0-11ed-8238-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "6f0f6450-622f-43b4-ae2f-ffabc18f9a2d",
            app_description:
                "JupyterLab Datascience (v3.3.4), with R (v4.1.3,0), RStudio, and Shiny\n",
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
                config: {},
                name: "JupyterLab_Datascience_Latest_with_RStudio_&_Shiny_analysis1",
                app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Datascience (latest) with RStudio Shiny",
        },
        {
            quick_launch_name: "Rocker RStudio Verse (latest)",
            quick_launch_creator: "cosimichele@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "3b5fc0ec-19a5-11ed-b38a-008cfa5ae621",
            added_on: "2022-08-11T11:52:27.331457Z",
            id: "beb78ba4-19a6-11ed-8238-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "ecc91edf-daf0-48fd-9c2b-e4a4fb7178ce",
            app_description:
                "Rocker RStudio Verse (v4.2.1) with CyVerse depends and iCommands",
            submission: {
                description: "",
                requirements: [
                    {
                        min_cpu_cores: 0,
                        min_memory_limit: 0,
                        min_disk_space: 0,
                        step_number: 0,
                        max_cpu_cores: 32,
                    },
                ],
                config: {},
                name: "Rocker_RStudio_Verse_(latest)_analysis1",
                app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/cosimichele/analyses",
                notify: true,
            },
            integrator: "cosimichele@iplantcollaborative.org",
            app_name: "Rocker RStudio Verse (latest)",
        },
        {
            quick_launch_name: "Xpra Desktop Ubuntu Geospatial 20.04",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c6a10c8-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-10-04T10:28:30.654782Z",
            id: "7e279a74-2538-11ec-9b15-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "755e40db-e623-4756-bd2a-d1c0ebffe97a",
            app_description:
                "Xpra Ubuntu (v20.04) browser-based Virtual Desktop \n\nFeatures a conda package manager, Python3, Go, Git, and iCommands.\n\nGeospatial software from OSGEO: QGIS latest, GRASS-GIS, SAGA-GIS, GDAL, Proj, GEOS, LASTools, PDAL & Entwine",
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
                    "f3f97c36-23d5-11ec-abcf-008cfa5ae621_f3fe835c-23d5-11ec-abcf-008cfa5ae621":
                        [],
                },
                name: "Xpra_Desktop_Ubuntu_Geospatial_20.04_analysis1",
                app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Xpra Desktop Ubuntu (20.04) Geospatial",
        },
        {
            quick_launch_name: "Datahog",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c947b92-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-11-30T10:42:30.039808Z",
            id: "e40340e8-5204-11ec-91f5-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "d34723d6-f7cc-4fe4-b39b-8b0986e43479",
            app_description:
                "iRODS File Dashboard\n\nview your account data storage size",
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
                    "d0ff2c68-392b-11e9-95ec-008cfa5ae621_d10602d6-392b-11e9-95ec-008cfa5ae621":
                        [],
                },
                name: "Datahog_analysis1",
                app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "upendra_35@iplantcollaborative.org",
            app_name: "DataHog",
        },
        {
            quick_launch_name: "JupyterLab Datascience Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c98385e-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-12-07T20:40:32.141892Z",
            id: "984da5e2-57d8-11ec-955a-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "4ab1f690-f360-4bba-bef9-d22f9f7b82f9",
            app_description: "Project Jupyter Lab Datascience (v3.3.4)",
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
                    "cc78752e-bc45-11eb-9934-008cfa5ae621_cc7e8cc0-bc45-11eb-9934-008cfa5ae621":
                        [],
                },
                name: "JupyterLab_Datascience_Latest_analysis1",
                app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Datascience (latest)",
        },
        {
            quick_launch_name: "cli",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c8f2b4c-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-12-08T11:14:50.536104Z",
            id: "bbf181e2-5852-11ec-8a47-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "4dca77f3-fb9c-4c6c-a19a-5288aa546e9b",
            app_description:
                "Cloud Shell built from Ubuntu 20.04 includes go, python, rust",
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
                    "5f2fe3b2-57b3-11ec-8180-008cfa5ae621_5f34244a-57b3-11ec-8180-008cfa5ae621":
                        [],
                },
                name: "Cloud_Shell_analysis1",
                app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Cloud Shell",
        },
        {
            quick_launch_name: "JupyterLab Geospatial Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c96a9b2-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-01-12T09:39:51.594469Z",
            id: "4391649e-73c6-11ec-ad77-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "e6484d73-96ba-4b0f-aba4-cb1fb7c97aea",
            app_description:
                "JupyterLab geospatial from the JupyterLab Datascience base image",
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
                    "0bb0e4c0-5d03-11ec-b195-008cfa5ae621_0bb608e2-5d03-11ec-b195-008cfa5ae621":
                        [],
                },
                name: "Jupyter_Lab_Geospatial_Latest_analysis1",
                app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Geospatial (latest)",
        },
        {
            quick_launch_name: "Custom Stan Maxed",
            quick_launch_creator: "culshawmaurer@iplantcollaborative.org",
            added_by: "culshawmaurer@iplantcollaborative.org",
            app_id: "069af414-7a34-11ec-abdc-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: false,
            app_version_id: "8c977d10-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-01-31T10:28:08.513234Z",
            id: "281d53e0-82bb-11ec-876a-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "ca5296bd-ee80-45aa-8195-38dd78759604",
            app_description:
                "Custom RStudio image with keyboard shortcuts, color theme, tidyverse, Stan, brms, tidybayes.",
            submission: {
                description: "",
                requirements: [
                    {
                        min_cpu_cores: 8,
                        min_memory_limit: 17179869184,
                        min_disk_space: 549755813888,
                        step_number: 0,
                    },
                ],
                config: {},
                name: "MCM_Custom_RStudio_Stan_analysis1",
                app_id: "069af414-7a34-11ec-abdc-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/culshawmaurer/analyses",
                notify: false,
            },
            integrator: "culshawmaurer@iplantcollaborative.org",
            app_name: "MCM Custom RStudio Stan",
        },
        {
            quick_launch_name: "VS Code",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c99c9d0-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-02-07T15:57:39.272816Z",
            id: "594c058e-8869-11ec-9897-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "298a1d98-9af6-457a-8332-6854f797abdd",
            app_description:
                "Open VS Code Server \n\nincludes go, python (conda), rustc (cargo), and iRODS iCommands",
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
                    "091d22b0-4be1-11ec-aad9-008cfa5ae621_fa81348e-8868-11ec-b7ac-008cfa5ae621":
                        [],
                },
                name: "VS_Code_analysis1",
                app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "VS Code (latest)",
        },
        {
            quick_launch_name: "RStudio Geospatial Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c983200-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-02-11T10:20:48.090422Z",
            id: "f4253466-8b5e-11ec-a2f8-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "49bd4b31-a697-44c5-aea9-bf3851f2011f",
            app_description:
                "Rocker RStudio Geospatial (v4.2.1) with CyVerse VICE depends and iCommands",
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
                    "5f00ecaa-7e10-11ec-a9b0-008cfa5ae621_5f073d1c-7e10-11ec-a9b0-008cfa5ae621":
                        [],
                },
                name: "Rocker_RStudio_Geospatial_Latest_analysis1",
                app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Rocker RStudio Geospatial (latest)",
        },
    ],
};

export const instantLaunchMetadata = {
    instant_launches: [
        {
            quick_launch_name:
                "JupyterLab Datascience Latest with RStudio & Shiny",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "c222d098-1995-11ed-986c-008cfa5ae621",
            added_on: "2022-08-11T11:10:40.845264Z",
            id: "e8bc4206-19a0-11ed-8238-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "6f0f6450-622f-43b4-ae2f-ffabc18f9a2d",
            app_description:
                "JupyterLab Datascience (v3.3.4), with R (v4.1.3,0), RStudio, and Shiny\n",
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
                config: {},
                name: "JupyterLab_Datascience_Latest_with_RStudio_&_Shiny_analysis1",
                app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Datascience (latest) with RStudio Shiny",
        },
        {
            quick_launch_name: "Rocker RStudio Verse (latest)",
            quick_launch_creator: "cosimichele@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "3b5fc0ec-19a5-11ed-b38a-008cfa5ae621",
            added_on: "2022-08-11T11:52:27.331457Z",
            id: "beb78ba4-19a6-11ed-8238-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "ecc91edf-daf0-48fd-9c2b-e4a4fb7178ce",
            app_description:
                "Rocker RStudio Verse (v4.2.1) with CyVerse depends and iCommands",
            submission: {
                description: "",
                requirements: [
                    {
                        min_cpu_cores: 0,
                        min_memory_limit: 0,
                        min_disk_space: 0,
                        step_number: 0,
                        max_cpu_cores: 32,
                    },
                ],
                config: {},
                name: "Rocker_RStudio_Verse_(latest)_analysis1",
                app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/cosimichele/analyses",
                notify: true,
            },
            integrator: "cosimichele@iplantcollaborative.org",
            app_name: "Rocker RStudio Verse (latest)",
        },
        {
            quick_launch_name: "Xpra Desktop Ubuntu Geospatial 20.04",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c6a10c8-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-10-04T10:28:30.654782Z",
            id: "7e279a74-2538-11ec-9b15-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "755e40db-e623-4756-bd2a-d1c0ebffe97a",
            app_description:
                "Xpra Ubuntu (v20.04) browser-based Virtual Desktop \n\nFeatures a conda package manager, Python3, Go, Git, and iCommands.\n\nGeospatial software from OSGEO: QGIS latest, GRASS-GIS, SAGA-GIS, GDAL, Proj, GEOS, LASTools, PDAL & Entwine",
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
                    "f3f97c36-23d5-11ec-abcf-008cfa5ae621_f3fe835c-23d5-11ec-abcf-008cfa5ae621":
                        [],
                },
                name: "Xpra_Desktop_Ubuntu_Geospatial_20.04_analysis1",
                app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Xpra Desktop Ubuntu (20.04) Geospatial",
        },
        {
            quick_launch_name: "Datahog",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c947b92-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-11-30T10:42:30.039808Z",
            id: "e40340e8-5204-11ec-91f5-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "d34723d6-f7cc-4fe4-b39b-8b0986e43479",
            app_description:
                "iRODS File Dashboard\n\nview your account data storage size",
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
                    "d0ff2c68-392b-11e9-95ec-008cfa5ae621_d10602d6-392b-11e9-95ec-008cfa5ae621":
                        [],
                },
                name: "Datahog_analysis1",
                app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "upendra_35@iplantcollaborative.org",
            app_name: "DataHog",
        },
        {
            quick_launch_name: "JupyterLab Datascience Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c98385e-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-12-07T20:40:32.141892Z",
            id: "984da5e2-57d8-11ec-955a-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "4ab1f690-f360-4bba-bef9-d22f9f7b82f9",
            app_description: "Project Jupyter Lab Datascience (v3.3.4)",
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
                    "cc78752e-bc45-11eb-9934-008cfa5ae621_cc7e8cc0-bc45-11eb-9934-008cfa5ae621":
                        [],
                },
                name: "JupyterLab_Datascience_Latest_analysis1",
                app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Datascience (latest)",
        },
        {
            quick_launch_name: "cli",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c8f2b4c-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2021-12-08T11:14:50.536104Z",
            id: "bbf181e2-5852-11ec-8a47-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "4dca77f3-fb9c-4c6c-a19a-5288aa546e9b",
            app_description:
                "Cloud Shell built from Ubuntu 20.04 includes go, python, rust",
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
                    "5f2fe3b2-57b3-11ec-8180-008cfa5ae621_5f34244a-57b3-11ec-8180-008cfa5ae621":
                        [],
                },
                name: "Cloud_Shell_analysis1",
                app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Cloud Shell",
        },
        {
            quick_launch_name: "JupyterLab Geospatial Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c96a9b2-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-01-12T09:39:51.594469Z",
            id: "4391649e-73c6-11ec-ad77-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "e6484d73-96ba-4b0f-aba4-cb1fb7c97aea",
            app_description:
                "JupyterLab geospatial from the JupyterLab Datascience base image",
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
                    "0bb0e4c0-5d03-11ec-b195-008cfa5ae621_0bb608e2-5d03-11ec-b195-008cfa5ae621":
                        [],
                },
                name: "Jupyter_Lab_Geospatial_Latest_analysis1",
                app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "JupyterLab Geospatial (latest)",
        },
        {
            quick_launch_name: "VS Code",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c99c9d0-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-02-07T15:57:39.272816Z",
            id: "594c058e-8869-11ec-9897-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "298a1d98-9af6-457a-8332-6854f797abdd",
            app_description:
                "Open VS Code Server \n\nincludes go, python (conda), rustc (cargo), and iRODS iCommands",
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
                    "091d22b0-4be1-11ec-aad9-008cfa5ae621_fa81348e-8868-11ec-b7ac-008cfa5ae621":
                        [],
                },
                name: "VS_Code_analysis1",
                app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "VS Code (latest)",
        },
        {
            quick_launch_name: "RStudio Geospatial Latest",
            quick_launch_creator: "tswetnam@iplantcollaborative.org",
            added_by: "tswetnam@iplantcollaborative.org",
            app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
            app_disabled: false,
            quick_launch_description: "",
            is_public: true,
            app_version_id: "8c983200-127a-11ed-9c8c-008cfa5ae621",
            added_on: "2022-02-11T10:20:48.090422Z",
            id: "f4253466-8b5e-11ec-a2f8-008cfa5ae621",
            app_deleted: false,
            quick_launch_id: "49bd4b31-a697-44c5-aea9-bf3851f2011f",
            app_description:
                "Rocker RStudio Geospatial (v4.2.1) with CyVerse VICE depends and iCommands",
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
                    "5f00ecaa-7e10-11ec-a9b0-008cfa5ae621_5f073d1c-7e10-11ec-a9b0-008cfa5ae621":
                        [],
                },
                name: "Rocker_RStudio_Geospatial_Latest_analysis1",
                app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
                system_id: "de",
                debug: false,
                create_output_subdir: true,
                output_dir: "/iplant/home/tswetnam/analyses",
                notify: true,
            },
            integrator: "tswetnam@iplantcollaborative.org",
            app_name: "Rocker RStudio Geospatial (latest)",
        },
    ],
};

export const instantLaunchMappings = {
    id: "8a89f33a-ad23-11eb-a641-008cfa5ae621",
    version: "1",
    mapping: {
        QGIS: {
            pattern: "*.qgz",
            kind: "glob",
            default: {
                id: "39bd13b8-d5f2-11eb-b2c1-008cfa5ae621",
                quick_launch_id: "b726cb41-580e-4847-bb54-78fefed21c72",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-25T13:16:29.242423Z",
            },
            compatible: [],
        },
        R: {
            pattern: "*.R",
            kind: "glob",
            default: {
                id: "619c2782-c9f1-11eb-84d3-008cfa5ae621",
                quick_launch_id: "83903e33-a47a-4cab-a56c-57817a1104af",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-10T06:40:12.684844Z",
            },
            compatible: [],
        },
        Rmd: {
            pattern: "*.Rmd",
            kind: "glob",
            default: {
                id: "619c2782-c9f1-11eb-84d3-008cfa5ae621",
                quick_launch_id: "83903e33-a47a-4cab-a56c-57817a1104af",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-10T06:40:12.684844Z",
            },
            compatible: [],
        },
        geojson: {
            pattern: "*.geojson",
            kind: "glob",
            default: {
                id: "47a2dc26-ad23-11eb-9f5f-008cfa5ae621",
                quick_launch_id: "a431b1f8-9e12-47dc-88b9-66804b98d256",
                added_by: "wregglej@iplantcollaborative.org",
                added_on: "2021-05-04T14:54:20.222903Z",
            },
            compatible: [],
        },
        ipynb: {
            pattern: "*.ipynb",
            kind: "glob",
            default: {
                id: "984da5e2-57d8-11ec-955a-008cfa5ae621",
                quick_launch_id: "4ab1f690-f360-4bba-bef9-d22f9f7b82f9",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-12-07T20:40:32.141892Z",
            },
            compatible: [],
        },
        python: {
            pattern: "python",
            kind: "infoType",
            default: {
                id: "e3d98b64-c9f0-11eb-a2b8-008cfa5ae621",
                quick_launch_id: "60054c75-0e80-4169-8a9b-51cba04f756d",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-10T06:36:41.694797Z",
            },
            compatible: [],
        },
        r: {
            pattern: "*.r",
            kind: "glob",
            default: {
                id: "619c2782-c9f1-11eb-84d3-008cfa5ae621",
                quick_launch_id: "83903e33-a47a-4cab-a56c-57817a1104af",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-10T06:40:12.684844Z",
            },
            compatible: [],
        },
        rmd: {
            pattern: "*.rmd",
            kind: "glob",
            default: {
                id: "619c2782-c9f1-11eb-84d3-008cfa5ae621",
                quick_launch_id: "83903e33-a47a-4cab-a56c-57817a1104af",
                added_by: "tswetnam@iplantcollaborative.org",
                added_on: "2021-06-10T06:40:12.684844Z",
            },
            compatible: [],
        },
    },
};

export const publicQuicklaunches = [
    {
        id: "2421c19e-ad85-4217-a21f-e0832f824171",
        name: "sample-quicklaunch",
        description: "",
        creator: "ipcdev@iplantcollaborative.org",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
        app_version_id: "8c92edd6-127a-11ed-9c8c-008cfa5ae621",
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
        app_version_id: "8c942ef8-127a-11ed-9c8c-008cfa5ae621",
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
        id: "38b74180-0cc7-47ee-b5c2-3fa3911c8f11",
        name: "test",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "ec3f07a4-5cef-11e9-ac96-008cfa5ae621",
        app_version_id: "8c9506de-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6c827e-5cef-11e9-ac96-008cfa5ae621": false,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec533d28-5cef-11e9-ac96-008cfa5ae621":
                    [],
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6ab098-5cef-11e9-ac96-008cfa5ae621": 20,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec67a740-5cef-11e9-ac96-008cfa5ae621":
                    "0",
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6c0bdc-5cef-11e9-ac96-008cfa5ae621": false,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec69cade-5cef-11e9-ac96-008cfa5ae621": 0,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6729c8-5cef-11e9-ac96-008cfa5ae621": 4,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec69077a-5cef-11e9-ac96-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Unstranded",
                        id: "ec691cb0-5cef-11e9-ac96-008cfa5ae621",
                        name: "-l",
                        value: "US",
                    },
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec627a54-5cef-11e9-ac96-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Hisat2",
                        id: "ec629ffc-5cef-11e9-ac96-008cfa5ae621",
                        name: "-t",
                        value: "",
                    },
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec5c267c-5cef-11e9-ac96-008cfa5ae621":
                    "",
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec7040bc-5cef-11e9-ac96-008cfa5ae621":
                    "RMTA_Output",
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec540320-5cef-11e9-ac96-008cfa5ae621":
                    [],
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6b977e-5cef-11e9-ac96-008cfa5ae621": false,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec681ebe-5cef-11e9-ac96-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "0",
                        id: "ec6837fa-5cef-11e9-ac96-008cfa5ae621",
                        name: "-f",
                        value: "0",
                    },
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec580dee-5cef-11e9-ac96-008cfa5ae621":
                    [],
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6a3e92-5cef-11e9-ac96-008cfa5ae621": 0,
                "ec3fa97a-5cef-11e9-ac96-008cfa5ae621_ec6b26d6-5cef-11e9-ac96-008cfa5ae621": 500000,
            },
            name: "OSG-RMTA_v2.5_analysis1",
            app_id: "ec3f07a4-5cef-11e9-ac96-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "ecf2e18c-e1bd-4438-8c78-7ec453743310",
        name: "test_data",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "b7bd9530-6880-11e9-a9ac-008cfa5ae621",
        app_version_id: "8c952902-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_862c8688-6881-11e9-a888-008cfa5ae621":
                    "gene_id",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e93802-6880-11e9-a9ac-008cfa5ae621": 0,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e9b30e-6880-11e9-a9ac-008cfa5ae621": 20,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7ef94b8-6880-11e9-a9ac-008cfa5ae621":
                    "RMTA_Output",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7cc659c-6880-11e9-a9ac-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/genomeservices/builds/1.0.0/24_77/Arabidopsis.TAIR10/de_support/annotation.gtf",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_862c36b0-6881-11e9-a888-008cfa5ae621":
                    "exon",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7eba646-6880-11e9-a9ac-008cfa5ae621": false,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e6dbde-6880-11e9-a9ac-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "0",
                        id: "b7e6f696-6880-11e9-a9ac-008cfa5ae621",
                        name: "-f",
                        value: "0",
                    },
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7d73814-6880-11e9-a9ac-008cfa5ae621":
                    [],
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e7d908-6880-11e9-a9ac-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Unstranded",
                        id: "b7e7f24e-6880-11e9-a9ac-008cfa5ae621",
                        name: "-l",
                        value: "US",
                    },
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7eb2d06-6880-11e9-a9ac-008cfa5ae621": false,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7ea318a-6880-11e9-a9ac-008cfa5ae621": 500000,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7c5748a-6880-11e9-a9ac-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/genomeservices/builds/1.0.0/24_77/Arabidopsis.TAIR10/de_support/genome.fa",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_862cd318-6881-11e9-a888-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "unstranded",
                        id: "862cefc4-6881-11e9-a888-008cfa5ae621",
                        name: "-n",
                        value: "0",
                    },
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7d2eaca-6880-11e9-a9ac-008cfa5ae621":
                    [],
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e51646-6880-11e9-a9ac-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Single End",
                        id: "b7e53766-6880-11e9-a9ac-008cfa5ae621",
                        name: "-y",
                        value: "SE",
                    },
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7eab07e-6880-11e9-a9ac-008cfa5ae621": false,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7dc829c-6880-11e9-a9ac-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/RMTA/sra_id_se.txt",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7db9828-6880-11e9-a9ac-008cfa5ae621":
                    "",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e5ccda-6880-11e9-a9ac-008cfa5ae621": 4,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e65286-6880-11e9-a9ac-008cfa5ae621":
                    "0",
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7d20290-6880-11e9-a9ac-008cfa5ae621":
                    [],
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e8b5f8-6880-11e9-a9ac-008cfa5ae621": 0,
                "b7be3a3a-6880-11e9-a9ac-008cfa5ae621_b7e0d860-6880-11e9-a9ac-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Hisat2",
                        id: "b7e10542-6880-11e9-a9ac-008cfa5ae621",
                        name: "-t",
                        value: "",
                    },
            },
            name: "test",
            app_id: "b7bd9530-6880-11e9-a9ac-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/test",
            notify: true,
        },
    },
    {
        id: "c8edde3f-eb08-4618-aa52-0b826a552f7c",
        name: "Example Quick Link",
        description: "",
        creator: "ipcdev@iplantcollaborative.org",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
        app_version_id: "8c92edd6-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "34f34466-9a8a-11e8-9c8e-008cfa5ae621_129ca6f8-f1bc-11e8-941d-008cfa5ae621":
                    "/iplant/home/shared/iplant_training/API",
                "34f34466-9a8a-11e8-9c8e-008cfa5ae621_34f89a92-9a8a-11e8-9c8e-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplant_training/tool_integration/phylip_interleaved.aln",
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
        id: "56660941-c2ea-43b8-8193-2fa95a22eee6",
        name: "test",
        description: "",
        creator: "sriram@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sriram/analyses",
            notify: true,
        },
    },
    {
        id: "7ec5e2a5-7198-49b0-97fd-452c6f903fe7",
        name: "Example with test data and $$ workaround",
        description: "",
        creator: "psarando@iplantcollaborative.org",
        app_id: "d6fb02e3-81b0-4fc5-a9d6-c9b08082201c",
        app_version_id: "8c7a6c8e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "677860fa-854a-11e4-b098-df2b78da5df6_44144c14-abe2-438b-bd28-a5d7f14f800a":
                    "/iplant/home/shared/iplantcollaborative/example_data/gnu_awk/Countries.txt",
                "677860fa-854a-11e4-b098-df2b78da5df6_bfee1601-546b-467f-ae9f-af63eee2b511":
                    "{print $$1, ($$3 - $$4)}",
            },
            name: "GNU_awk_analysis1",
            app_id: "d6fb02e3-81b0-4fc5-a9d6-c9b08082201c",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/psarando/analyses",
            notify: true,
        },
    },
    {
        id: "9d03357f-b7ad-4f39-bbda-7949329d3320",
        name: "Jupyter Lab SciPy",
        description: "",
        creator: "tyson_swetnam@iplantcollaborative.org",
        app_id: "5cc447b6-9f38-11e9-8d50-008cfa5ae621",
        app_version_id: "8c95fcc4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "5cc519de-9f38-11e9-8d50-008cfa5ae621_5cc74358-9f38-11e9-8d50-008cfa5ae621":
                    [],
                "5cc519de-9f38-11e9-8d50-008cfa5ae621_5ccdd678-9f38-11e9-8d50-008cfa5ae621":
                    "",
            },
            name: "Jupyter_Lab_SciPy_analysis1",
            app_id: "5cc447b6-9f38-11e9-8d50-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tyson_swetnam/analyses",
            notify: true,
        },
    },
    {
        id: "cdedea7c-fce4-4fd0-80f9-458aee28d186",
        name: "Jupyter Lab SciPy",
        description: "",
        creator: "tyson_swetnam@iplantcollaborative.org",
        app_id: "5cc447b6-9f38-11e9-8d50-008cfa5ae621",
        app_version_id: "8c95fcc4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "5cc519de-9f38-11e9-8d50-008cfa5ae621_5cc74358-9f38-11e9-8d50-008cfa5ae621":
                    [],
                "5cc519de-9f38-11e9-8d50-008cfa5ae621_5ccdd678-9f38-11e9-8d50-008cfa5ae621":
                    "",
            },
            name: "Jupyter_Lab_SciPy_analysis1",
            app_id: "5cc447b6-9f38-11e9-8d50-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tyson_swetnam/analyses",
            notify: true,
        },
    },
    {
        id: "e86c4c51-8f34-4bc5-a062-b6fd26898a13",
        name: "TERRA REF quick launch test",
        description: "",
        creator: "dlebauer@iplantcollaborative.org",
        app_id: "e1a1cd32-f8b7-11e8-b0d2-008cfa5ae621",
        app_version_id: "8c943024-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "terra-rstudio-geospatial_analysis1",
            app_id: "e1a1cd32-f8b7-11e8-b0d2-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dlebauer/analyses",
            notify: true,
        },
    },
    {
        id: "ba90ed7b-9ba5-4cb5-961f-098209aa968a",
        name: "RStudio Geospatial Latest",
        description: "",
        creator: "tyson_swetnam@iplantcollaborative.org",
        app_id: "9d72460c-b921-11e9-a1f1-008cfa5ae621",
        app_version_id: "8c96294c-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "9d73412e-b921-11e9-a1f1-008cfa5ae621_9d79feb0-b921-11e9-a1f1-008cfa5ae621":
                    "",
            },
            name: "RStudio_Geospatial_Latest_analysis1",
            app_id: "9d72460c-b921-11e9-a1f1-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tyson_swetnam/analyses",
            notify: true,
        },
    },
    {
        id: "27203e0f-e2a1-4846-be0c-e97cb6ef60f2",
        name: "TERRA REF Rstudio 3.6.0",
        description: "",
        creator: "dlebauer@iplantcollaborative.org",
        app_id: "041dd9c4-b964-11e9-a238-008cfa5ae621",
        app_version_id: "8c961f92-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "041e92ce-b964-11e9-a238-008cfa5ae621_04249854-b964-11e9-a238-008cfa5ae621":
                    "",
            },
            name: "TERRA_REF_Rstudio_3.6.0_analysis1",
            app_id: "041dd9c4-b964-11e9-a238-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dlebauer/analyses",
            notify: true,
        },
    },
    {
        id: "c2f4ca1d-1451-470e-9f42-f33c63cc7b2e",
        name: "rocker-geospatial-3.5.0",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "a8b22ed8-e2bc-11e8-a839-008cfa5ae621",
        app_version_id: "8c93de94-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "rocker-geospatial-3.5.0_analysis1",
            app_id: "a8b22ed8-e2bc-11e8-a839-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "a7509bf3-a019-4814-b9fa-f1788d0f68a0",
        name: "RStudio Geospatial 3.6.0",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "33939454-bbb3-11e9-9fb7-008cfa5ae621",
        app_version_id: "8c9637c0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "RStudio_Geospatial_3.6.0_analysis1",
            app_id: "33939454-bbb3-11e9-9fb7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "0d864f71-4be4-4217-aded-38940d0cbbcb",
        name: "RStudio Geospatial 3.4.2",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "57330f1c-bbc6-11e9-9b4a-008cfa5ae621",
        app_version_id: "8c96391e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "RStudio_Geospatial_3.4.2_analysis1",
            app_id: "57330f1c-bbc6-11e9-9b4a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "b1232ba3-311a-4c8a-b9bf-fb3f5fdcbeea",
        name: "Jupyter Lab Qiime2 2018.11",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "827928ce-5649-11e9-8f31-008cfa5ae621",
        app_version_id: "8c94ed34-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "8279baa0-5649-11e9-8f31-008cfa5ae621_828099ec-5649-11e9-8f31-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-Qiime2-2018.11_analysis1",
            app_id: "827928ce-5649-11e9-8f31-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "19f6a94b-71b6-4034-a7a5-40f7bea0b85b",
        name: "Jupyter Lab Data Science Notebook Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "75773c76-8ee1-11e9-907f-008cfa5ae621",
        app_version_id: "8c9587d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_Data_Science_Notebook_Latest_analysis1",
            app_id: "75773c76-8ee1-11e9-907f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "efef126d-56d3-4e5e-9400-ecd43da59cc0",
        name: "Jupyter Lab SciPy Notebook Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "05ad3aaa-8ef8-11e9-980d-008cfa5ae621",
        app_version_id: "8c96325c-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_SciPy_Notebook_Latest_analysis1",
            app_id: "05ad3aaa-8ef8-11e9-980d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "f52b3c13-c16c-4ace-b689-7c90d9ab417d",
        name: "Rocker RStudio Geospatial 3.5.3",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "0395a4e8-5265-11e9-82ce-008cfa5ae621",
        app_version_id: "8c94c368-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Rocker_RStudio_Geospatial_v3.5.3_analysis1",
            app_id: "0395a4e8-5265-11e9-82ce-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "409d1b8a-def8-4f34-8405-0e1ddd9a1e0d",
        name: "demo-launch",
        description: "",
        creator: "sriram@iplantcollaborative.org",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
        app_version_id: "8c92edd6-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "34f34466-9a8a-11e8-9c8e-008cfa5ae621_34f89a92-9a8a-11e8-9c8e-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-0.0.3_analysis1",
            app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sriram/analyses",
            notify: true,
        },
    },
    {
        id: "ca7bfbac-da6a-4a2c-808c-5841ececc172",
        name: "ExampleQuickLaunch",
        description: "",
        creator: "nowlanf@iplantcollaborative.org",
        app_id: "91c41516-8c89-11e9-890e-008cfa5ae621",
        app_version_id: "8c972888-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "91c4fecc-8c89-11e9-890e-008cfa5ae621_91c694bc-8c89-11e9-890e-008cfa5ae621":
                    "/iplant/home/nowlanf/Human/HG00097.chrom11.ILLUMINA.bwa.GBR.exome.20130415.bam",
                "91c4fecc-8c89-11e9-890e-008cfa5ae621_bd9d0bba-8d1b-11e9-8836-008cfa5ae621":
                    "FILE.bedgraph",
            },
            name: "IGB_Bedtools_Genome_Coverage_analysis",
            app_id: "91c41516-8c89-11e9-890e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/nowlanf/analyses",
            notify: true,
        },
    },
    {
        id: "11bf8d09-4162-4369-8bab-eca13af76af6",
        name: "hello_word_count",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: false,
        submission: {
            config: {
                "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "/iplant/home/sarahr/hello.r",
            },
            name: "dewc_201908221637",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "fb0258ae-d9af-4a37-87e8-f7dcb4032311",
        name: "dewc",
        description: "",
        creator: "ipcdev@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/ipcdev/analyses",
            notify: true,
        },
    },
    {
        id: "75a91267-c0d6-420c-97b0-1805d37c9ebf",
        name: "Nanopore_RNA-Seq_webinar",
        description: "",
        creator: "upendra_35@iplantcollaborative.org",
        app_id: "58f9a86c-2a74-11e9-b289-008cfa5ae621",
        app_version_id: "8c947df4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "58fa96d2-2a74-11e9-b289-008cfa5ae621_5905d84e-2a74-11e9-b289-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/VICE/Nanopore_RNAseq_workflow",
                "58fa96d2-2a74-11e9-b289-008cfa5ae621_59041540-2a74-11e9-b289-008cfa5ae621":
                    [],
            },
            name: "Rstudio-DESeq2_analysis1_webinar_demo",
            app_id: "58f9a86c-2a74-11e9-b289-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/upendra_35/analyses",
            notify: true,
        },
    },
    {
        id: "5311db1e-34df-43e5-b474-36810acf917c",
        name: "JupLab-CLI",
        description: "",
        creator: "elyons@iplantcollaborative.org",
        app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
        app_version_id: "8c92edd6-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "34f34466-9a8a-11e8-9c8e-008cfa5ae621_34f89a92-9a8a-11e8-9c8e-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-0.0.3_analysis1",
            app_id: "34f2c392-9a8a-11e8-9c8e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/elyons/analyses",
            notify: true,
        },
    },
    {
        id: "91c72a5d-0ce9-484f-a1f1-feba4cab75a5",
        name: "Jupyter Lab SciPy Notebook latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
        app_version_id: "8c9654d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_SciPy_Notebook_Latest_analysis1",
            app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "2f4c736a-9f3f-40e5-91a0-264097073cbc",
        name: "GOanna",
        description: "",
        creator: "amcooksey@iplantcollaborative.org",
        app_id: "354731ae-71ab-11e9-b82a-008cfa5ae621",
        app_version_id: "8c967082-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc204f6-71ae-11e9-b2e7-008cfa5ae621": 3,
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc374ee-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc69368-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc6cca2-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc34190-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc3093c-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc71090-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc24d08-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_c2ee51c6-c43b-11e9-8c0d-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc2d0e8-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc28ca0-71ae-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_3cc3d196-71ae-11e9-b2e7-008cfa5ae621": false,
                "35482bea-71ab-11e9-b82a-008cfa5ae621_7a5696b2-71ac-11e9-b2e7-008cfa5ae621":
                    "",
                "35482bea-71ab-11e9-b82a-008cfa5ae621_7a55cdcc-71ac-11e9-b2e7-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Yes",
                        id: "3cc19c28-71ae-11e9-b2e7-008cfa5ae621",
                        name: "-b",
                        value: "yes",
                    },
            },
            name: "GOanna_1.0_analysis1",
            app_id: "354731ae-71ab-11e9-b82a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/amcooksey/analyses",
            notify: false,
        },
    },
    {
        id: "a02c1fa2-648b-4cb4-ae40-d5ca5c8cdbb6",
        name: "JupyterLab-QIIME2-2019.7",
        description: "",
        creator: "atcochra90@iplantcollaborative.org",
        app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
        app_version_id: "8c9676e0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8bcdb94-dfb5-11e9-a9d3-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/QIIME2-2019-7/QIIME2-2019-7-moving-pictures.ipynb",
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8be5884-dfb5-11e9-a9d3-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-QIIME2-2019.7_analysis1",
            app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/atcochra90/analyses",
            notify: true,
        },
    },
    {
        id: "cc7cd75c-0ea2-4074-bb7f-fbad72a29b73",
        name: "demo_mmtf",
        description: "",
        creator: "nirav@iplantcollaborative.org",
        app_id: "ad36b1e4-2dae-11e9-af23-008cfa5ae621",
        app_version_id: "8c946f62-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ad3789a2-2dae-11e9-af23-008cfa5ae621_ad40f5be-2dae-11e9-af23-008cfa5ae621":
                    [],
            },
            name: "mmtf-genomics-vice_0.3.6_analysis1",
            app_id: "ad36b1e4-2dae-11e9-af23-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/nirav/analyses",
            notify: true,
        },
    },
    {
        id: "0b4c1063-ec26-4ec2-8f30-803e0b7e1ff7",
        name: "Jupyterlabql",
        description: "",
        creator: "vibhormehta@iplantcollaborative.org",
        app_id: "238da900-c81f-11e9-a1b1-008cfa5ae621",
        app_version_id: "8c962e6a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "238e5c10-c81f-11e9-a1b1-008cfa5ae621_23977afc-c81f-11e9-a1b1-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-with-sql-1.0.5_analysis1",
            app_id: "238da900-c81f-11e9-a1b1-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/vibhormehta/analyses",
            notify: true,
        },
    },
    {
        id: "4265939e-ebeb-4936-9f4a-5fa23cb736ad",
        name: "Bowtie2Build-2.2.4 indexer",
        description: "",
        creator: "tsbutterfield@iplantcollaborative.org",
        app_id: "aa65db9e-9a8b-11e4-b9b7-0f1d2deb5049",
        app_version_id: "8c8d709a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "aa667bf8-9a8b-11e4-81d9-e7f7249dfbc6_aa74f80e-9a8b-11e4-8e73-fb9b57ad732e":
                    "reference_index",
            },
            name: "Bowtie2Build-2.2.4_indexer_analysis1",
            app_id: "aa65db9e-9a8b-11e4-b9b7-0f1d2deb5049",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tsbutterfield/analyses",
            notify: true,
        },
    },
    {
        id: "694ae50d-7725-46b6-82a8-a04755c3e43a",
        name: "Jupyterlab-SciPy GEE",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
        app_version_id: "8c683b9a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_SciPy_Google_Earth_Engine_analysis1",
            app_id: "1f5e7f3a-e46c-11e9-870d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "25862506-3ffe-4867-8e2b-664d9df47ce3",
        name: "Jupyterlab-SciPy Planet Labs",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "0c91c2b0-eab9-11e9-a785-008cfa5ae621",
        app_version_id: "8c70dc14-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0c927d4a-eab9-11e9-a785-008cfa5ae621_c1ffa3dc-eaba-11e9-ad50-008cfa5ae621":
                    "",
            },
            name: "JupyterLab_SciPy_Planet_Labs_analysis1",
            app_id: "0c91c2b0-eab9-11e9-a785-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "87ef1f23-7dc5-47af-b47f-0811f20408a9",
        name: "testytest",
        description: "",
        creator: "aramsey@iplantcollaborative.org",
        app_id: "e54bfc1a-f811-11e8-8a14-008cfa5ae621",
        app_version_id: "8c942ef8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "e54cc5c8-f811-11e8-8a14-008cfa5ae621_e5559568-f811-11e8-8a14-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/DESeq/DESeq_results_significant.txt",
                    ],
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
        id: "4f8eb968-72c8-4e53-8fb7-ec531ca0f08f",
        name: "ignoreme",
        description: "",
        creator: "aramsey@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "/iplant/home/shared/iplantcollaborative/example_data/DESeq/DESeq_results_significant.txt",
            },
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/aramsey/analyses",
            notify: true,
        },
    },
    {
        id: "12889c80-f38d-4737-bc38-1cda6badce39",
        name: "shiny-geospatial",
        description: "",
        creator: "bridgettaylor@iplantcollaborative.org",
        app_id: "203b0bc2-e2a5-11e8-9df7-008cfa5ae621",
        app_version_id: "8c93e7c2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "geospatial-shiny_analysis1",
            app_id: "203b0bc2-e2a5-11e8-9df7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/bridgettaylor/analyses",
            notify: true,
        },
    },
    {
        id: "20995c04-d3b5-4061-becc-23c128f9a3a3",
        name: "QL Test",
        description: "",
        creator: "mgwall@iplantcollaborative.org",
        app_id: "676846d4-854a-11e4-980d-7f0fcca75dbb",
        app_version_id: "8c7f2846-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "6784fad6-854a-11e4-a68a-fff491e96051_722ca966-064a-460c-a377-78e887d4ade2":
                    "",
                "6784fad6-854a-11e4-a68a-fff491e96051_03fdd79c-e8ab-4cc9-8060-b9a47f0609dc":
                    {
                        isDefault: true,
                        display: "exon_id (combination name)",
                        id: "5236659c-856e-11e4-9b74-23fe6f01b57b",
                        name: " ",
                        value: "-t exon_id",
                    },
                "6784fad6-854a-11e4-a68a-fff491e96051_a5a2ff4a-3868-432e-90f3-6d3e97e87f65": false,
                "6784fad6-854a-11e4-a68a-fff491e96051_8c56cc17-5338-4c10-a969-b1c29add595c":
                    {
                        isDefault: true,
                        display: "transcript_id",
                        id: "523407fc-856e-11e4-bbfa-c7b1c93ea76c",
                        name: " ",
                        value: "-e transcript_id",
                    },
                "6784fad6-854a-11e4-a68a-fff491e96051_86a131dd-7506-43d1-ba4b-4b614a6e56f7":
                    "",
                "6784fad6-854a-11e4-a68a-fff491e96051_3df1d825-e4a8-4659-bb2a-f4c8571d0acb": 0.95,
                "6784fad6-854a-11e4-a68a-fff491e96051_596d38b5-2035-48b8-aeed-d57b06affc25":
                    {
                        isDefault: true,
                        display: "gene_id",
                        id: "5232efa2-856e-11e4-837b-9b646a960936",
                        name: " ",
                        value: "-c gene_id",
                    },
                "6784fad6-854a-11e4-a68a-fff491e96051_7864e474-586f-4097-a833-8cf32cc17a80": false,
                "6784fad6-854a-11e4-a68a-fff491e96051_1650b9c7-3890-443b-a970-5dcda08011c5":
                    "",
                "6784fad6-854a-11e4-a68a-fff491e96051_7505225b-844a-4a37-944e-92fddabff61c":
                    "",
                "6784fad6-854a-11e4-a68a-fff491e96051_1b24a24e-e267-4c7e-a46b-a33dfe6ccd15":
                    "output_transcripts.gff",
            },
            name: "Annotate_transcripts_analysis1",
            app_id: "676846d4-854a-11e4-980d-7f0fcca75dbb",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/mgwall/analyses",
            notify: true,
        },
    },
    {
        id: "0fe69a8f-216d-4103-abd8-a2080af82876",
        name: "QIIME2 v2019.10 Jupyter Lab",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
        app_version_id: "8c930050-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_QIIME2_2019.10_analysis1",
            app_id: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "f08b98b3-3b26-4b13-93a0-cf1932d2c7f0",
        name: "Jupyterlab Planet Labs",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "1d35dc48-eb93-11e9-b6b7-008cfa5ae621",
        app_version_id: "8c8e44c0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "1d36a1c8-eb93-11e9-b6b7-008cfa5ae621_1d38b79c-eb93-11e9-b6b7-008cfa5ae621":
                    "",
            },
            name: "Jupyter-SciPy_Planet_Labs_analysis1",
            app_id: "1d35dc48-eb93-11e9-b6b7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "027d5ab8-0fc5-4dc4-a0b2-bd1ae15409bc",
        name: "Terrain API Tutorial",
        description: "",
        creator: "elyons@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [
                        "/iplant/home/shared/cyverse_training/tutorials/terrain_intro/terrain-intro.ipynb",
                    ],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/elyons/analyses",
            notify: true,
        },
    },
    {
        id: "266f8f99-63c6-4bfa-977b-aab8ebd087b3",
        name: "JupyterLab 1.0.9",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "76e98e23-f55c-4ef3-878a-a8a1625f4ec4",
        name: "Vibrant_mixed_fasta",
        description: "",
        creator: "upendra_35@iplantcollaborative.org",
        app_id: "c2864d3c-fd03-11e9-9cf4-008cfa5ae621",
        app_version_id: "8c8f261a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_c28b67fe-fd03-11e9-9cf4-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/vibrant/example_data/mixed_example.fasta",
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_6b9fba50-fd9c-11e9-9db5-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Nucelotide",
                        id: "6b9ff858-fd9c-11e9-9db5-008cfa5ae621",
                        name: "-f",
                        value: "nucl",
                    },
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_0d76f4f6-fd9d-11e9-9db5-008cfa5ae621":
                    "1",
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_b2abf522-ff21-11e9-bd82-008cfa5ae621": 1000,
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_8dffecd6-ff23-11e9-870c-008cfa5ae621": 4,
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_0d78081e-fd9d-11e9-9db5-008cfa5ae621": false,
                "c2872946-fd03-11e9-9cf4-008cfa5ae621_0d7859f4-fd9d-11e9-9db5-008cfa5ae621": false,
            },
            name: "VIBRANT-1.0.1_analysis1",
            app_id: "c2864d3c-fd03-11e9-9cf4-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/upendra_35/analyses",
            notify: true,
        },
    },
    {
        id: "21524cbf-6d26-4a62-a8e6-bef731938255",
        name: "RNAseq_Webinar_RMTA",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "ed43b8be-daf5-11e9-9393-008cfa5ae621",
        app_version_id: "8c7ae65a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edc9b46e-daf5-11e9-9393-008cfa5ae621":
                    "RMTA_Output",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed58d3ca-daf5-11e9-9393-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/genomeservices/builds/1.0.0/24_77/Arabidopsis.TAIR10/de_support/genome.fa",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edb0b61c-daf5-11e9-9393-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "0",
                        id: "edb145aa-daf5-11e9-9393-008cfa5ae621",
                        name: "-f",
                        value: "0",
                    },
                "ed465b50-daf5-11e9-9393-008cfa5ae621_eda8b926-daf5-11e9-9393-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Single End",
                        id: "eda940f8-daf5-11e9-9393-008cfa5ae621",
                        name: "-y",
                        value: "SE",
                    },
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed7ecd28-daf5-11e9-9393-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371313_1.fastq.gz",
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371314_1.fastq.gz",
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371315_1.fastq.gz",
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371316_1.fastq.gz",
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371317_1.fastq.gz",
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/RNAseq_Webinar_fastq_dump/sra_out/SRR3371318_1.fastq.gz",
                    ],
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed9bda94-daf5-11e9-9393-008cfa5ae621":
                    "exon",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed9edd16-daf5-11e9-9393-008cfa5ae621":
                    "gene_id",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_eda1a262-daf5-11e9-9393-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "unstranded",
                        id: "eda214e0-daf5-11e9-9393-008cfa5ae621",
                        name: "-n",
                        value: "0",
                    },
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edba5096-daf5-11e9-9393-008cfa5ae621": 0,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edc1f1ca-daf5-11e9-9393-008cfa5ae621": true,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edabbca2-daf5-11e9-9393-008cfa5ae621": 8,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed674c66-daf5-11e9-9393-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/genomeservices/builds/1.0.0/24_77/Arabidopsis.TAIR10/de_support/annotation.gtf",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edb55c4e-daf5-11e9-9393-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Unstranded",
                        id: "edb59a6a-daf5-11e9-9393-008cfa5ae621",
                        name: "-l",
                        value: "US",
                    },
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edc3be42-daf5-11e9-9393-008cfa5ae621": false,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed765828-daf5-11e9-9393-008cfa5ae621":
                    [],
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edbc72cc-daf5-11e9-9393-008cfa5ae621": 20,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed87493a-daf5-11e9-9393-008cfa5ae621":
                    "",
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed7205c0-daf5-11e9-9393-008cfa5ae621":
                    [],
                "ed465b50-daf5-11e9-9393-008cfa5ae621_ed93f360-daf5-11e9-9393-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Hisat2",
                        id: "ed9470a6-daf5-11e9-9393-008cfa5ae621",
                        name: "-t",
                        value: "",
                    },
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edc022aa-daf5-11e9-9393-008cfa5ae621": false,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edbe5fe2-daf5-11e9-9393-008cfa5ae621": 500000,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edb85ad4-daf5-11e9-9393-008cfa5ae621": 0,
                "ed465b50-daf5-11e9-9393-008cfa5ae621_edae2da2-daf5-11e9-9393-008cfa5ae621":
                    "0",
            },
            name: "RNAseq_Webinar_RMTA",
            app_id: "ed43b8be-daf5-11e9-9393-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/RNAseq_webinar_2",
            notify: true,
        },
    },
    {
        id: "80e972aa-c2ce-4e62-a4ba-3b8e320940b3",
        name: "QGIS Xpra Desktop",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
        app_version_id: "8c975ee8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "QGIS_Xpra_Desktop_analysis1",
            app_id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "1444198d-068f-4cf1-a3d1-df30e6d678f2",
        name: "RNAseq_Webinar_DESeq2",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "58f9a86c-2a74-11e9-b289-008cfa5ae621",
        app_version_id: "8c947df4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "58fa96d2-2a74-11e9-b289-008cfa5ae621_59041540-2a74-11e9-b289-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/RNAseq_Webinar/DESeq2_script.R",
                    ],
            },
            name: "RNAseq_Webinar_DESeq2",
            app_id: "58f9a86c-2a74-11e9-b289-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "fb5c8443-0c65-46da-ba1b-dc21938a097c",
        name: "SequenceServer App",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
        app_version_id: "8c813956-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_ab4597ee-ff20-11e9-a09c-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/sequenceserver/db",
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_c763c004-ff20-11e9-8422-008cfa5ae621": 1,
            },
            name: "sequenceserver_analysis1",
            app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "0ade6455-4876-49cc-9b37-a29129d9558a",
        name: "GEA_Blast_Tutorial",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
        app_version_id: "8c813956-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_ab4597ee-ff20-11e9-a09c-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/GEA_Blast_dbs",
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_c763c004-ff20-11e9-8422-008cfa5ae621": 8,
            },
            name: "sequenceserver_analysis1",
            app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/test",
            notify: true,
        },
    },
    {
        id: "71430e46-d142-4d25-b79e-d7a15415b913",
        name: "TERRA_REF_Rstudio_3.6.0_analysis1",
        description: "",
        creator: "naomiy@iplantcollaborative.org",
        app_id: "041dd9c4-b964-11e9-a238-008cfa5ae621",
        app_version_id: "8c961f92-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "041e92ce-b964-11e9-a238-008cfa5ae621_04249854-b964-11e9-a238-008cfa5ae621":
                    "",
            },
            name: "TERRA_REF_Rstudio_3.6.0_analysis1",
            app_id: "041dd9c4-b964-11e9-a238-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/naomiy/analyses",
            notify: true,
        },
    },
    {
        id: "eaea18de-4031-45d3-8023-009fd681bc45",
        name: "jconstant",
        description: "",
        creator: "jconstant@iplantcollaborative.org",
        app_id: "f20cf57e-f3b2-11e4-98ed-f7f22e34dcdc",
        app_version_id: "8c6abce4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "f20d95ce-f3b2-11e4-969e-5f58f97a1a6a_8a655b9e-f463-11e4-94f9-b3d800bad568":
                    ".",
                "f20d95ce-f3b2-11e4-969e-5f58f97a1a6a_f211f600-f3b2-11e4-82db-9b25857d0faf":
                    "",
                "f20d95ce-f3b2-11e4-969e-5f58f97a1a6a_f21269f0-f3b2-11e4-b490-7f8ee1eeedbb":
                    "",
            },
            name: "iclimate-data-v1.0_analysis1",
            app_id: "f20cf57e-f3b2-11e4-98ed-f7f22e34dcdc",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jconstant/analyses",
            notify: true,
        },
    },
    {
        id: "b19b3b00-0b6f-4c28-9d0f-23c965264309",
        name: "NEON workshop workspace",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "580bbc6e-161e-11eb-880c-008cfa5ae621",
        app_version_id: "8c931022-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "580c8554-161e-11eb-880c-008cfa5ae621_580eb054-161e-11eb-880c-008cfa5ae621":
                    "/iplant/home/shared/NEON_workshop",
                "580c8554-161e-11eb-880c-008cfa5ae621_5810d0fa-161e-11eb-880c-008cfa5ae621":
                    [],
            },
            name: "Workspace_Geospatial_analysis1",
            app_id: "580bbc6e-161e-11eb-880c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "abce1ed0-8fb4-4cc5-bef3-3a9530446dc6",
        name: "RStudio Geospatial v3.6.3",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "1903c788-1947-11eb-8f3e-008cfa5ae621",
        app_version_id: "8c9483da-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "19047dd6-1947-11eb-8f3e-008cfa5ae621_19086a2c-1947-11eb-8f3e-008cfa5ae621":
                    [],
            },
            name: "RStudio_Geospatial_3.6.3_analysis1",
            app_id: "1903c788-1947-11eb-8f3e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "80451d08-2183-4085-8fa0-d29a764dca91",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "4f94e974-ff81-11ea-acb0-008cfa5ae621",
        app_version_id: "8c9a4a18-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "sra-tools_prefetch_analysis1",
            app_id: "4f94e974-ff81-11ea-acb0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "0c6dcb40-afab-4bd2-8f91-9715212abe61",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "d563c068-0358-11eb-b24f-008cfa5ae621",
        app_version_id: "8c9a4b94-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d5649768-0358-11eb-b24f-008cfa5ae621_d56763bc-0358-11eb-b24f-008cfa5ae621":
                    [],
            },
            name: "sra-tools_vdb-validate_analysis1",
            app_id: "d563c068-0358-11eb-b24f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "fea0aadb-888d-420f-8d9c-989f65beb3c1",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "c32b39ea-035c-11eb-8c0c-008cfa5ae621",
        app_version_id: "8c9a391a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "c32bf7a4-035c-11eb-8c0c-008cfa5ae621_c3336dae-035c-11eb-8c0c-008cfa5ae621":
                    [],
            },
            name: "sra-tools_fasterq-dump_analysis1",
            app_id: "c32b39ea-035c-11eb-8c0c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "033737f2-9add-4de9-a1b4-ad0dd49d56aa",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "dbd0de10-97da-11e6-8f91-008cfa5ae621",
        app_version_id: "8c8cb5d8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "dbd16452-97da-11e6-8f91-008cfa5ae621_dbd329f4-97da-11e6-8f91-008cfa5ae621":
                    [],
            },
            name: "FastQC_0.11.5__multi-file__analysis1",
            app_id: "dbd0de10-97da-11e6-8f91-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "6132e25c-6576-4c84-bd6f-9e343e5ef03a",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "c341ba8c-30ad-11e8-8fb4-008cfa5ae621",
        app_version_id: "8c90dde8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c355f344-30ad-11e8-8fb4-008cfa5ae621":
                    [],
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35723cc-30ad-11e8-8fb4-008cfa5ae621":
                    [],
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35c96b8-30ad-11e8-8fb4-008cfa5ae621": 0,
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35d644e-30ad-11e8-8fb4-008cfa5ae621":
                    "",
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35df986-30ad-11e8-8fb4-008cfa5ae621":
                    "",
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_02214c18-30ae-11e8-8fb4-008cfa5ae621": false,
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35e8e5a-30ad-11e8-8fb4-008cfa5ae621": false,
                "c3427936-30ad-11e8-8fb4-008cfa5ae621_c35f3ce2-30ad-11e8-8fb4-008cfa5ae621": false,
            },
            name: "Kallisto-v.0.43.1_analysis1",
            app_id: "c341ba8c-30ad-11e8-8fb4-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "afd0da48-455d-4201-aafb-fe92d38f7986",
        name: "pb_vol3",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "4809de5a-037b-11eb-a1cc-008cfa5ae621",
        app_version_id: "8c9a62be-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "480a5bbe-037b-11eb-a1cc-008cfa5ae621_bf2e44d8-0e72-11eb-9722-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/tutorials/pbv3/R",
            },
            name: "RStudio_Sleuth_pb_analysis1",
            app_id: "4809de5a-037b-11eb-a1cc-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "6ac3e123-d882-4fe8-8ae0-5cb29a419fa0",
        name: "GA20x",
        description: "",
        creator: "dr_richard_barker@iplantcollaborative.org",
        app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
        app_version_id: "8c9654d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_SciPy_Notebook_Latest_analysis1",
            app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dr_richard_barker/analyses",
            notify: true,
        },
    },
    {
        id: "fe76e002-a9e2-4e38-9091-3b3c4ae81adc",
        name: "met yieldwm",
        description: "",
        creator: "wardah618@iplantcollaborative.org",
        app_id: "af14e76b-83bf-4a8a-a475-9d686e1bb868",
        app_version_id: "8c930b4a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "f1ae8d86-9a53-11e8-af78-008cfa5ae621_75f12511-e6d3-4ce1-a113-06801f9396d3":
                    [],
            },
            name: "rstudio-3.5.0_analysis1",
            app_id: "af14e76b-83bf-4a8a-a475-9d686e1bb868",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/wardah618/analyses",
            notify: true,
        },
    },
    {
        id: "393772af-04c2-4585-9171-eda2d1e4ad22",
        name: "Orange ML",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "5c680ad4-393c-11ea-88f4-008cfa5ae621",
        app_version_id: "8c8c87ac-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Orange-ML-Xpra_analysis1",
            app_id: "5c680ad4-393c-11ea-88f4-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "6d60ccb8-132c-4732-976f-ac02645ad22b",
        name: "Nanodj-demo-data-transfer",
        description: "",
        creator: "upendra_35@iplantcollaborative.org",
        app_id: "b0e5bdc4-6226-11e9-a28f-008cfa5ae621",
        app_version_id: "8c95108e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "b0e63678-6226-11e9-a28f-008cfa5ae621_b0ecd0a0-6226-11e9-a28f-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/nanodj/data_transfer.sh",
                    ],
            },
            name: "NanoDJ_analysis1",
            app_id: "b0e5bdc4-6226-11e9-a28f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/upendra_35/analyses",
            notify: true,
        },
    },
    {
        id: "1296e3c5-329a-44d6-8c3b-a57a3fe80695",
        name: "Nanodj-demo",
        description: "",
        creator: "upendra_35@iplantcollaborative.org",
        app_id: "b0e5bdc4-6226-11e9-a28f-008cfa5ae621",
        app_version_id: "8c95108e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "b0e63678-6226-11e9-a28f-008cfa5ae621_b0ecd0a0-6226-11e9-a28f-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/nanodj/data_transfer.sh",
                    ],
            },
            name: "NanoDJ_analysis1",
            app_id: "b0e5bdc4-6226-11e9-a28f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/upendra_35/analyses",
            notify: true,
        },
    },
    {
        id: "5427183c-19a5-4105-8ce3-ebbf5313ac9d",
        name: "GEA-Leptin-RNA-Seq",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "f109453a-21be-11ea-b74e-008cfa5ae621",
        app_version_id: "8c94e5f0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "f109d112-21be-11ea-b74e-008cfa5ae621_f112891a-21be-11ea-b74e-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/notebooks",
                "f109d112-21be-11ea-b74e-008cfa5ae621_f117691c-21be-11ea-b74e-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/data",
            },
            name: "GEA_Leptin_RNA_Seq_Lab_dev_3_0_analysis1",
            app_id: "f109453a-21be-11ea-b74e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "31c607e2-e619-4897-9722-c7260711b2fc",
        name: "auto-ml-vice",
        description: "",
        creator: "pwrose@iplantcollaborative.org",
        app_id: "8cd50cac-56b2-11e9-8a78-008cfa5ae621",
        app_version_id: "8c94cd54-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "8cd62b32-56b2-11e9-8a78-008cfa5ae621_8ce141a2-56b2-11e9-8a78-008cfa5ae621":
                    [],
            },
            name: "auto-ml-vice_analysis1",
            app_id: "8cd50cac-56b2-11e9-8a78-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/pwrose/analyses",
            notify: true,
        },
    },
    {
        id: "46b38247-1f5d-454f-9350-79d0dc2b5a04",
        name: "Kraken2",
        description: "",
        creator: "elyons@iplantcollaborative.org",
        app_id: "077c7862-e085-11e9-9a40-008cfa5ae621",
        app_version_id: "8c94554a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "077cfdd2-e085-11e9-9a40-008cfa5ae621_07835fba-e085-11e9-9a40-008cfa5ae621":
                    [],
            },
            name: "NanoDJ-metagenomics-Kraken2_analysis1",
            app_id: "077c7862-e085-11e9-9a40-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/elyons/analyses",
            notify: true,
        },
    },
    {
        id: "76138a2c-3b6b-4494-b79a-7f5200b2b237",
        name: "gea_3.1dev_leptin",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
        app_version_id: "8c96d392-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba39f6c-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/notebooks",
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba8de82-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/data",
            },
            name: "3.1_dev_GEA_Leptin_RNA_Seq_Lab_analysis1",
            app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "836bb85f-41db-47dc-8f4f-65a8595aa2c4",
        name: "PDAL Pipeline",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "8132982c-0b86-11ea-a290-008cfa5ae621",
        app_version_id: "8c963a54-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "PDAL_EPT_pipeline_analysis1",
            app_id: "8132982c-0b86-11ea-a290-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "32f5b964-26c0-4740-bb6f-5768c47292d7",
        name: "visualization-working-group",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "74d44974-e93d-11e9-8c4d-008cfa5ae621",
        app_version_id: "8c6eff66-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "74d50c24-e93d-11e9-8c4d-008cfa5ae621_74d6e9ae-e93d-11e9-8c4d-008cfa5ae621":
                    [],
                "74d50c24-e93d-11e9-8c4d-008cfa5ae621_74d81860-e93d-11e9-8c4d-008cfa5ae621":
                    "/iplant/home/shared/visualization-working-group",
            },
            name: "genepattern-notebook_analysis1",
            app_id: "74d44974-e93d-11e9-8c4d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "8e002616-e030-4ee1-bcaf-e6ce20986e14",
        name: "plantmd-ql",
        description: "",
        creator: "upendra_35@iplantcollaborative.org",
        app_id: "c148e480-4fff-11ea-b1a6-008cfa5ae621",
        app_version_id: "8c973378-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Plantmd_analysis1",
            app_id: "c148e480-4fff-11ea-b1a6-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/upendra_35/analyses",
            notify: true,
        },
    },
    {
        id: "41863dac-57a9-49e3-b272-1e62e28c9de0",
        name: "shiny-0.10.2.2",
        description: "",
        creator: "vibhormehta@iplantcollaborative.org",
        app_id: "266f6028-205b-45c9-b1c3-11f9be9dcfe5",
        app_version_id: "8c930c76-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "f25c480e-9a53-11e8-af78-008cfa5ae621_51f74eca-b5e4-11e8-949d-008cfa5ae621":
                    [],
            },
            name: "shiny-0.10.2.2_analysis1",
            app_id: "266f6028-205b-45c9-b1c3-11f9be9dcfe5",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/vibhormehta/analyses",
            notify: true,
        },
    },
    {
        id: "138ca024-65df-43e9-9a78-d9c7ae9e162f",
        name: "Rstudio-TSIS-1.0",
        description: "",
        creator: "vibhormehta@iplantcollaborative.org",
        app_id: "60d7f4f0-fd9f-11e8-9781-008cfa5ae621",
        app_version_id: "8c943f60-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "60dc2070-fd9f-11e8-9781-008cfa5ae621_60e590a6-fd9f-11e8-9781-008cfa5ae621":
                    [],
            },
            name: "Rstudio-TSIS-1.0_analysis1",
            app_id: "60d7f4f0-fd9f-11e8-9781-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/vibhormehta/analyses",
            notify: true,
        },
    },
    {
        id: "8159ebd9-9fe4-4c9c-a9a5-818b0267ee6f",
        name: "Rstudio-ClusterProflier-3.8",
        description: "",
        creator: "vibhormehta@iplantcollaborative.org",
        app_id: "aade92d8-f733-11e8-8a98-008cfa5ae621",
        app_version_id: "8c8de82c-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "aadf1064-f733-11e8-8a98-008cfa5ae621_aae47cb6-f733-11e8-8a98-008cfa5ae621":
                    [],
            },
            name: "Rstudio-ClusterProfiler-3.8_analysis1",
            app_id: "aade92d8-f733-11e8-8a98-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/vibhormehta/analyses",
            notify: true,
        },
    },
    {
        id: "4090ecef-b2c3-4ce3-bc01-74ef8437e7f1",
        name: "Rstudio-Ballgown",
        description: "",
        creator: "vibhormehta@iplantcollaborative.org",
        app_id: "657bc4dc-2e32-11e9-bb10-008cfa5ae621",
        app_version_id: "8c945bee-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "657c9916-2e32-11e9-bb10-008cfa5ae621_6586a8ac-2e32-11e9-bb10-008cfa5ae621":
                    [],
            },
            name: "Rstudio-Ballgown_analysis1",
            app_id: "657bc4dc-2e32-11e9-bb10-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/vibhormehta/analyses",
            notify: true,
        },
    },
    {
        id: "61b3e88b-db92-437f-b10f-0931918d69ce",
        name: "Felix MAINGI",
        description: "",
        creator: "felix22@iplantcollaborative.org",
        app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
        app_version_id: "8c9676e0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8bcdb94-dfb5-11e9-a9d3-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/QIIME2-2019-7/QIIME2-2019-7-moving-pictures.ipynb",
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8be5884-dfb5-11e9-a9d3-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-QIIME2-2019.7_analysis1",
            app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/felix22/analyses",
            notify: true,
        },
    },
    {
        id: "d7d1f6f7-7ebe-49f7-b492-67af5755dcba",
        name: "efsan",
        description: "",
        creator: "efsann@iplantcollaborative.org",
        app_id: "decdd668-5616-11e7-9724-008cfa5ae621",
        app_version_id: "8c8ec936-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "dece7546-5616-11e7-9724-008cfa5ae621_deda7684-5616-11e7-9724-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Nucleotide",
                        id: "dedaa014-5616-11e7-9724-008cfa5ae621",
                        name: "-dbtype",
                        value: "nucl",
                    },
                "dece7546-5616-11e7-9724-008cfa5ae621_dedb6378-5616-11e7-9724-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Fasta",
                        id: "dedb8b5a-5616-11e7-9724-008cfa5ae621",
                        name: "-input_type ",
                        value: "fasta",
                    },
                "dece7546-5616-11e7-9724-008cfa5ae621_dedc5f8a-5616-11e7-9724-008cfa5ae621":
                    "blastdb",
                "dece7546-5616-11e7-9724-008cfa5ae621_dedd0dcc-5616-11e7-9724-008cfa5ae621":
                    "",
                "dece7546-5616-11e7-9724-008cfa5ae621_dedf8e44-5616-11e7-9724-008cfa5ae621":
                    "1GB",
            },
            name: "Create_BLAST_database-2.6.0__analysis1",
            app_id: "decdd668-5616-11e7-9724-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/efsann/analyses",
            notify: true,
        },
    },
    {
        id: "8d6bb12b-36fa-4df0-ae73-122d3d946aeb",
        name: "efsan",
        description: "",
        creator: "efsann@iplantcollaborative.org",
        app_id: "decdd668-5616-11e7-9724-008cfa5ae621",
        app_version_id: "8c8ec936-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "dece7546-5616-11e7-9724-008cfa5ae621_deda7684-5616-11e7-9724-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Nucleotide",
                        id: "dedaa014-5616-11e7-9724-008cfa5ae621",
                        name: "-dbtype",
                        value: "nucl",
                    },
                "dece7546-5616-11e7-9724-008cfa5ae621_dedb6378-5616-11e7-9724-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Fasta",
                        id: "dedb8b5a-5616-11e7-9724-008cfa5ae621",
                        name: "-input_type ",
                        value: "fasta",
                    },
                "dece7546-5616-11e7-9724-008cfa5ae621_dedc5f8a-5616-11e7-9724-008cfa5ae621":
                    "blastdb",
                "dece7546-5616-11e7-9724-008cfa5ae621_dedd0dcc-5616-11e7-9724-008cfa5ae621":
                    "",
                "dece7546-5616-11e7-9724-008cfa5ae621_dedf8e44-5616-11e7-9724-008cfa5ae621":
                    "1GB",
            },
            name: "Create_BLAST_database-2.6.0__analysis1",
            app_id: "decdd668-5616-11e7-9724-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/efsann/analyses",
            notify: true,
        },
    },
    {
        id: "7b6c6732-e843-4c88-85a4-3355d69c28aa",
        name: "Nidheesh M.",
        description: "",
        creator: "ammasnidhi@iplantcollaborative.org",
        app_id: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
        app_version_id: "8c930050-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_QIIME2_2019.10_analysis1",
            app_id: "58150fe4-01cf-11ea-8c41-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/ammasnidhi/analyses",
            notify: true,
        },
    },
    {
        id: "6b4a961f-b51e-431b-a38d-81f752e2f858",
        name: "gpnb-word-count",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "/iplant/home/shared/visualization-working-group/GPNB GeneFab URLs demo 2020.ipynb",
            },
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "7a62a49e-7fee-4822-b128-a1b2485e2941",
        name: "snakemake_rnaseq",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "9e989f50-6109-11ea-ab9d-008cfa5ae621",
        app_version_id: "8c97d7ba-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "9e9921e6-6109-11ea-ab9d-008cfa5ae621_e9b162ec-6109-11ea-ab9d-008cfa5ae621":
                    [],
            },
            name: "Snakemake-VICE_analysis1",
            app_id: "9e989f50-6109-11ea-ab9d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "6010632e-aaeb-4bdf-9fa7-abc5b474a2d0",
        name: "pasp",
        description: "",
        creator: "arubini@iplantcollaborative.org",
        app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
        app_version_id: "8c813956-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_ab4597ee-ff20-11e9-a09c-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/sequenceserver/db",
                "ab40b616-ff20-11e9-a09c-008cfa5ae621_c763c004-ff20-11e9-8422-008cfa5ae621": 4,
            },
            name: "sequenceserver_analysis1",
            app_id: "ab404686-ff20-11e9-a09c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/arubini/analyses",
            notify: true,
        },
    },
    {
        id: "3dda8777-0b17-4e69-af69-9c5c290411f7",
        name: "HTSeqQC 1.0",
        description: "",
        creator: "ren_cys@iplantcollaborative.org",
        app_id: "b91ffda4-4df0-11ea-bd40-008cfa5ae621",
        app_version_id: "8c97ca86-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b923fe22-4df0-11ea-bd40-008cfa5ae621":
                    "0.9",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9230bc0-4df0-11ea-bd40-008cfa5ae621": 0,
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b923bb4c-4df0-11ea-bd40-008cfa5ae621":
                    "",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9243cb6-4df0-11ea-bd40-008cfa5ae621":
                    "20",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9247e06-4df0-11ea-bd40-008cfa5ae621":
                    "False",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b925248c-4df0-11ea-bd40-008cfa5ae621":
                    "fastq",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9235ca6-4df0-11ea-bd40-008cfa5ae621":
                    "",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9238c08-4df0-11ea-bd40-008cfa5ae621":
                    "",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b924bc40-4df0-11ea-bd40-008cfa5ae621":
                    "5",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b921c788-4df0-11ea-bd40-008cfa5ae621":
                    [],
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9255ed4-4df0-11ea-bd40-008cfa5ae621":
                    "False",
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b9226f76-4df0-11ea-bd40-008cfa5ae621":
                    [],
                "b9207c52-4df0-11ea-bd40-008cfa5ae621_b924fb74-4df0-11ea-bd40-008cfa5ae621":
                    "",
            },
            name: "HTSeqQC_1.0_analysis1",
            app_id: "b91ffda4-4df0-11ea-bd40-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/ren_cys/analyses",
            notify: true,
        },
    },
    {
        id: "4775341f-9883-485f-9f8a-7c2feb89a865",
        name: "Jupyter Lab PDAL",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "42f2d156-9b89-11ea-831e-008cfa5ae621",
        app_version_id: "8c98caa8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_PDAL_analysis1",
            app_id: "42f2d156-9b89-11ea-831e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "99ee60a8-5ab4-4a26-82f5-d6c7bac3818f",
        name: "terrain-intro",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/terrain/terrain-intro.ipynb",
                    ],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "d3fd785a-d1c9-4641-88af-8d9ca4ac06be",
        name: "Cornell_lncRNA_discovery",
        description: "",
        creator: "andrewnelson@iplantcollaborative.org",
        app_id: "40a37486-2f2f-11e9-820d-008cfa5ae621",
        app_version_id: "8c94694a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40b5f156-2f2f-11e9-820d-008cfa5ae621":
                    "Output",
            },
            name: "Evolinc-I_v1.7.5_analysis1",
            app_id: "40a37486-2f2f-11e9-820d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/andrewnelson/analyses",
            notify: true,
        },
    },
    {
        id: "b506e4ad-21c7-40dc-8fe6-338847a5de05",
        name: "Cornell_lncRNA_discovery",
        description: "",
        creator: "andrewnelson@iplantcollaborative.org",
        app_id: "40a37486-2f2f-11e9-820d-008cfa5ae621",
        app_version_id: "8c94694a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40afa6a2-2f2f-11e9-820d-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Evolinc.sample.data/Evolinc-I/Sample_cuffcompare_out.gtf",
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40b225da-2f2f-11e9-820d-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Evolinc.sample.data/Evolinc-I/TAIR10_chr.fasta",
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40b54954-2f2f-11e9-820d-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Evolinc.sample.data/Evolinc-I/TAIR10_genes.gff",
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40b5f156-2f2f-11e9-820d-008cfa5ae621":
                    "Output",
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40bad25c-2f2f-11e9-820d-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Evolinc.sample.data/Evolinc-I/Sample_TSS_data.gff",
                "40a41530-2f2f-11e9-820d-008cfa5ae621_40bb826a-2f2f-11e9-820d-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Evolinc.sample.data/Evolinc-I/Sample_known_lncRNAs.gff",
            },
            name: "Evolinc-I_v1.7.5_analysis1",
            app_id: "40a37486-2f2f-11e9-820d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/andrewnelson/analyses",
            notify: true,
        },
    },
    {
        id: "8cd10b51-a9ea-42c5-8f8c-9469b99ab84e",
        name: "faiza",
        description: "",
        creator: "faiza369@iplantcollaborative.org",
        app_id: "e00853e4-e31f-47eb-8a6d-ec8c9215efb9",
        app_version_id: "8c7ab036-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "67789c78-854a-11e4-8c69-ffc86e697d52_d58dd634-c093-26ed-4e8a-973fbbd8bf82":
                    "",
                "67789c78-854a-11e4-8c69-ffc86e697d52_e7bc1be0-f6d0-abde-8301-7ff991b75a77":
                    "",
                "67789c78-854a-11e4-8c69-ffc86e697d52_58482530-1322-ea2c-595c-e4fd039fee8f":
                    "",
                "67789c78-854a-11e4-8c69-ffc86e697d52_b06d3176-5198-02a0-8ae0-8305c0b90df3":
                    "",
                "67789c78-854a-11e4-8c69-ffc86e697d52_fa624c19-d74e-20c9-9456-1a358291f738":
                    "",
            },
            name: "Fastq-Join_analysis1",
            app_id: "e00853e4-e31f-47eb-8a6d-ec8c9215efb9",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/faiza369/analyses",
            notify: true,
        },
    },
    {
        id: "636a416a-65c4-4f18-928d-8783825f803a",
        name: "QIIME2",
        description: "",
        creator: "thutchi@iplantcollaborative.org",
        app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
        app_version_id: "8c9676e0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8bcdb94-dfb5-11e9-a9d3-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/QIIME2-2019-7/QIIME2-2019-7-moving-pictures.ipynb",
                "2036939c-d031-11e9-a43f-008cfa5ae621_e8be5884-dfb5-11e9-a9d3-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-QIIME2-2019.7_analysis1",
            app_id: "2035c1ce-d031-11e9-a43f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/thutchi/analyses",
            notify: true,
        },
    },
    {
        id: "70c7958f-534e-4ff6-86b7-9bfb7598c242",
        name: "JupyterLab-with-SQL-1.0.9",
        description: "",
        creator: "marys@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/marys/analyses",
            notify: true,
        },
    },
    {
        id: "4cbcf6dd-e913-456d-92fc-ba2ab5317bef",
        name: "test77777",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
        app_version_id: "8c96d392-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba39f6c-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/notebooks",
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba8de82-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/data",
            },
            name: "3.1_dev_GEA_Leptin_RNA_Seq_Lab_analysis1",
            app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "e3090821-7eb9-404b-bf1a-bab9260b8891",
        name: "for-ray",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
        app_version_id: "8c987986-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0d93bcce-7b3a-11ea-846b-008cfa5ae621_0d98fd74-7b3a-11ea-846b-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/notebooks",
                "0d93bcce-7b3a-11ea-846b-008cfa5ae621_0d9db684-7b3a-11ea-846b-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/data",
            },
            name: "Jupyter_Fastqe_analysis1",
            app_id: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "c7251468-9320-41e4-9831-5702c9b57f6a",
        name: "june2020-lol-app",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "859af8ee-b18c-11ea-8fbb-008cfa5ae621",
        app_version_id: "8c9942ee-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "859b8d40-b18c-11ea-8fbb-008cfa5ae621_85a3834c-b18c-11ea-8fbb-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/notebooks",
                "859b8d40-b18c-11ea-8fbb-008cfa5ae621_85a9696a-b18c-11ea-8fbb-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/data",
                "859b8d40-b18c-11ea-8fbb-008cfa5ae621_79f779e4-b18d-11ea-9dc0-008cfa5ae621":
                    [],
            },
            name: "junk_delete_copy_analysis1",
            app_id: "859af8ee-b18c-11ea-8fbb-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "fce147f5-8c2d-4178-b725-63a68f2fde97",
        name: "RStudio Stan Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "7be7ec22-bbf9-11ea-81ef-008cfa5ae621",
        app_version_id: "8c9926b0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "RStudio_Stan_analysis1",
            app_id: "7be7ec22-bbf9-11ea-81ef-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "a6063961-3992-4fa7-a774-b3031e4847c1",
        name: "Jupyter-lab",
        description: "",
        creator: "gavieira@iplantcollaborative.org",
        app_id: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
        app_version_id: "8c987986-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0d93bcce-7b3a-11ea-846b-008cfa5ae621_0d98fd74-7b3a-11ea-846b-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/notebooks",
                "0d93bcce-7b3a-11ea-846b-008cfa5ae621_0d9db684-7b3a-11ea-846b-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/data",
            },
            name: "Jupyter_Fastqe_analysis1",
            app_id: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/gavieira/analyses",
            notify: true,
        },
    },
    {
        id: "e7383172-dafd-42a2-b539-a67a9b65425e",
        name: "Rocker RStudio Geospatial 3.6.3",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "6943b4f2-b663-11ea-92c5-008cfa5ae621",
        app_version_id: "8c7a780a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Rocker_RStudio_Geospatial_3.6.3_analysis1",
            app_id: "6943b4f2-b663-11ea-92c5-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "9699effa-2325-416f-b9bd-f30863826daf",
        name: "FIELDimageR",
        description: "",
        creator: "dlebauer@iplantcollaborative.org",
        app_id: "7193c02e-cc58-11ea-8806-008cfa5ae621",
        app_version_id: "8c9a1192-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "FIELDimageR_analysis1",
            app_id: "7193c02e-cc58-11ea-8806-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dlebauer/analyses",
            notify: true,
        },
    },
    {
        id: "e70467b0-6847-4b2f-95c9-5526af500e1f",
        name: "fossql-ml-minimal",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
        app_version_id: "8c99ab3a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0f4ba8d0-e6ef-11ea-844a-008cfa5ae621_0f4e27d6-e6ef-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "ml-workspace-minimal_analysis1",
            app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "fb7d1330-9b39-458c-b760-60bde08301b6",
        name: "workspace",
        description: "",
        creator: "xzheng@iplantcollaborative.org",
        app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
        app_version_id: "8c99ab3a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0f4ba8d0-e6ef-11ea-844a-008cfa5ae621_0f4e27d6-e6ef-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "ml-workspace-minimal_analysis1",
            app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/xzheng/analyses",
            notify: true,
        },
    },
    {
        id: "dae5b2c8-adee-4003-85a2-346bee62b30e",
        name: "RStudio tidyverse",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
        app_version_id: "8c99aef0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15084884-e7e2-11ea-a750-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_TidyVerse_v3.6.3_analysis1",
            app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "e88ca42c-f9c9-42b9-96ec-fbe90cc98032",
        name: "bjconnor60",
        description: "",
        creator: "bjconnor60@iplantcollaborative.org",
        app_id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
        app_version_id: "8c975ee8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "QGIS_Xpra_Desktop_analysis1",
            app_id: "a847402e-ff2a-11e9-815d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/bjconnor60/analyses",
            notify: true,
        },
    },
    {
        id: "6daa39eb-ffd9-41c8-89d1-52e5268961e4",
        name: "Nicolas Santos Bioinformatica",
        description: "",
        creator: "nico5500@iplantcollaborative.org",
        app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
        app_version_id: "8c9654d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "Jupyter_Lab_SciPy_Notebook_Latest_analysis1",
            app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/nico5500/analyses",
            notify: true,
        },
    },
    {
        id: "b2e99af8-361b-4bc5-889e-d080e845fda9",
        name: "Bio_302",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
        app_version_id: "8c99aef0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15084884-e7e2-11ea-a750-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_TidyVerse_v3.6.3_analysis1",
            app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "66f5a2d6-04c3-4346-8804-fab350e2f9b8",
        name: "workspace-geospatial",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "55f4f8b0-f552-11ea-80fa-008cfa5ae621",
        app_version_id: "8c9a0f08-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "55f5d15e-f552-11ea-80fa-008cfa5ae621_55f9c912-f552-11ea-80fa-008cfa5ae621":
                    [],
            },
            name: "workspace-geospatial_analysis1",
            app_id: "55f4f8b0-f552-11ea-80fa-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "63afd24c-9acc-4a8c-85ef-58b634a2ebc2",
        name: "JupyterLab Geospatial",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "c940912c-fcea-11ea-b07f-008cfa5ae621",
        app_version_id: "8c9a3118-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "c9410cb0-fcea-11ea-b07f-008cfa5ae621_c9439228-fcea-11ea-b07f-008cfa5ae621":
                    [],
            },
            name: "Jupyter_Lab_Geospatial_analysis1",
            app_id: "c940912c-fcea-11ea-b07f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "ff6719c2-90ef-43d8-98bb-7608c9c0a32b",
        name: "public-ql",
        description: "",
        creator: "sriram@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "/iplant/home/shared/cyverse_training/example/coffee_cake.txt",
            },
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/sriram/bulk",
            notify: true,
        },
    },
    {
        id: "d6867085-607a-455b-b889-995cbe17266f",
        name: "terrain-automation-examples",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [
                        "/iplant/home/shared/workshop_material/terrain_intro/terrain-automation.ipynb",
                    ],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "aa9f3ace-66d0-4264-9a5c-fa85986095d7",
        name: "Orange ML TurboVNC",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "48d98722-116d-11eb-bb38-008cfa5ae621",
        app_version_id: "8c8ea334-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "48da437e-116d-11eb-bb38-008cfa5ae621_48de3d58-116d-11eb-bb38-008cfa5ae621":
                    [],
            },
            name: "Orange_ML_analysis1",
            app_id: "48d98722-116d-11eb-bb38-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "2929f074-2712-451c-a17b-216130245a14",
        name: "nirav",
        description: "",
        creator: "nirav@iplantcollaborative.org",
        app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
        app_version_id: "8c947b92-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "d0ff2c68-392b-11e9-95ec-008cfa5ae621_d10602d6-392b-11e9-95ec-008cfa5ae621":
                    [],
            },
            name: "Datahog_analysis1",
            app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/nirav/analyses",
            notify: true,
        },
    },
    {
        id: "e67dc248-145d-4d96-8331-82229c63a076",
        name: "ORANGEMLswetnam",
        description: "",
        creator: "mirage@iplantcollaborative.org",
        app_id: "48d98722-116d-11eb-bb38-008cfa5ae621",
        app_version_id: "8c8ea334-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "48da437e-116d-11eb-bb38-008cfa5ae621_48de3d58-116d-11eb-bb38-008cfa5ae621":
                    [],
            },
            name: "Orange_ML_analysis1",
            app_id: "48d98722-116d-11eb-bb38-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/mirage/analyses",
            notify: true,
        },
    },
    {
        id: "2f8ddb4c-53b0-42de-96e0-9ce464d74e52",
        name: "RGB Canopy Cover",
        description: "",
        creator: "dlebauer@iplantcollaborative.org",
        app_id: "62b78ddc-c6be-11ea-abce-008cfa5ae621",
        app_version_id: "8c996a08-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "62b81018-c6be-11ea-abce-008cfa5ae621_0932581e-c6c3-11ea-ae41-008cfa5ae621":
                    [],
                "62b81018-c6be-11ea-abce-008cfa5ae621_62bb23de-c6be-11ea-abce-008cfa5ae621":
                    "",
            },
            name: "Calculate_Canopy_Cover_analysis1",
            app_id: "62b78ddc-c6be-11ea-abce-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dlebauer/analyses",
            notify: true,
        },
    },
    {
        id: "5b6a55ba-9124-4a18-9a3c-cd26731d0693",
        name: "kkyong77",
        description: "",
        creator: "kkyong77@iplantcollaborative.org",
        app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
        app_version_id: "8c99ab3a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0f4ba8d0-e6ef-11ea-844a-008cfa5ae621_0f4e27d6-e6ef-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "ml-workspace-minimal_analysis1",
            app_id: "0f4b3044-e6ef-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/kkyong77/analyses",
            notify: true,
        },
    },
    {
        id: "275fb7e9-f708-4b01-be69-46b474926cb9",
        name: "example",
        description: "",
        creator: "renkejhsph@iplantcollaborative.org",
        app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
        app_version_id: "8c6dfe04-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d61e56f0-e921-11e9-8fe0-008cfa5ae621_d62788d8-e921-11e9-8fe0-008cfa5ae621":
                    [
                        "/iplant/home/shared/iplantcollaborative/example_data/terrain/terrain-intro.ipynb",
                    ],
            },
            name: "JupyterLab-with-sql-1.0.9_analysis1",
            app_id: "d61d9a26-e921-11e9-8fe0-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/renkejhsph/analyses",
            notify: false,
        },
    },
    {
        id: "b3de1376-1670-41d7-93ae-c95c63a95143",
        name: "Ray",
        description: "",
        creator: "sriram@iplantcollaborative.org",
        app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
        app_version_id: "8c97ccf2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "089a61a0-23d9-4021-9354-a8498ef3ff19_13914010-89cd-406d-99c3-9c4ff8b023c3":
                    "/iplant/home/shared/cyverse_training/example/pipeline.json",
            },
            name: "DE_Word_Count_analysis1",
            app_id: "67d15627-22c5-42bd-8daf-9af5deecceab",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sriram/bulk",
            notify: true,
        },
    },
    {
        id: "700178e5-1d01-4eed-b5d7-9592f385be67",
        name: "dina_",
        description: "",
        creator: "dina_@iplantcollaborative.org",
        app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
        app_version_id: "8c96d392-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba39f6c-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/notebooks",
                "2b9de5b8-3162-11ea-a78a-008cfa5ae621_2ba8de82-3162-11ea-a78a-008cfa5ae621":
                    "/iplant/home/shared/gea/rna-seq-leptin/data",
            },
            name: "3.1_dev_GEA_Leptin_RNA_Seq_Lab_analysis1",
            app_id: "2b9d31fe-3162-11ea-a78a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/dina_/analyses",
            notify: true,
        },
    },
    {
        id: "c79a69ea-d730-4735-978e-cf622eab535a",
        name: "MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "33152660-1480-11eb-9ec7-008cfa5ae621",
        app_version_id: "8c92a15a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "6f41c64e-148e-11eb-8a37-008cfa5ae621_7077d44a-e3fa-11e6-83b4-008cfa5ae621":
                    "TAIR10_chr_all",
                "6f41c64e-148e-11eb-8a37-008cfa5ae621_70793ea2-e3fa-11e6-83b4-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference",
                "6f41c64e-148e-11eb-8a37-008cfa5ae621_70830644-e3fa-11e6-83b4-008cfa5ae621":
                    "out.sam",
                "6f4200dc-148e-11eb-8a37-008cfa5ae621_0024e7fe-13d1-11eb-ba6b-008cfa5ae621":
                    "output.bam",
                "6f423106-148e-11eb-8a37-008cfa5ae621_d319261a-148b-11eb-84f1-008cfa5ae621":
                    "output_sorted.bam",
                "6f423106-148e-11eb-8a37-008cfa5ae621_d31a5c42-148b-11eb-84f1-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "BAM",
                        id: "d31ab3a4-148b-11eb-84f1-008cfa5ae621",
                        name: "-O",
                        value: "bam",
                    },
                "6f423106-148e-11eb-8a37-008cfa5ae621_d3200c0a-148b-11eb-84f1-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "sort by reference coordinates",
                        id: "d3203504-148b-11eb-84f1-008cfa5ae621",
                        name: " ",
                        value: "",
                    },
            },
            name: "Bowtie2-Map-SortBam_Workflow_analysis1",
            app_id: "33152660-1480-11eb-9ec7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "cbb86d61-8803-4e74-979a-969df571c11e",
        name: "MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "0d12486e-dcde-11ea-99fc-008cfa5ae621",
        app_version_id: "8c9a0c2e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "0d12d752-dcde-11ea-99fc-008cfa5ae621_0d1441aa-dcde-11ea-99fc-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "0d12d752-dcde-11ea-99fc-008cfa5ae621_0d159d2a-dcde-11ea-99fc-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/parents/SHOREmap_created_F2Pab_specific.txt",
                "0d12d752-dcde-11ea-99fc-008cfa5ae621_9cd4205e-ebdd-11ea-9ac4-008cfa5ae621": false,
                "0d12d752-dcde-11ea-99fc-008cfa5ae621_0d16490a-dcde-11ea-99fc-008cfa5ae621":
                    "extract",
            },
            name: "SHOREmap-extract-v3.8_analysis1",
            app_id: "0d12486e-dcde-11ea-99fc-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "f0d39399-11c8-4f47-a36d-aed2d4083fee",
        name: "EMS05-MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
        app_version_id: "8c9a1de0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5b7dcc-e1a8-11ea-b0ad-008cfa5ae621": 5,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f57c798-ed6a-11ea-b188-008cfa5ae621": false,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56e602-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd345c-e1aa-11ea-8c63-008cfa5ae621": 0.02,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a598f1c-e1a8-11ea-b0ad-008cfa5ae621": 10,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5c6b7e-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06ccec86-e1aa-11ea-8c63-008cfa5ae621": 1,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cba4b6-e1aa-11ea-8c63-008cfa5ae621": 200000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5cde56-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a8be2-e1a8-11ea-b0ad-008cfa5ae621": 25,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cbec32-e1aa-11ea-8c63-008cfa5ae621": 5000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a51f8ce-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/parents/SHOREmap_created_F2Pab_specific.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a616688-e1a8-11ea-b0ad-008cfa5ae621":
                    "outcross",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f572996-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a0bae-e1a8-11ea-b0ad-008cfa5ae621": 80,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cc3728-e1aa-11ea-8c63-008cfa5ae621": 0.98,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56924c-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5bf144-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a4b7bd4-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f5783fa-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd7d54-e1aa-11ea-8c63-008cfa5ae621": 1,
            },
            name: "SHOREmap-outcross-v3.8_analysis1",
            app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "a320a31f-8dcb-4263-b478-961e85e27298",
        name: "EMS02-MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
        app_version_id: "8c9a1de0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5b7dcc-e1a8-11ea-b0ad-008cfa5ae621": 5,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f57c798-ed6a-11ea-b188-008cfa5ae621": false,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56e602-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd345c-e1aa-11ea-8c63-008cfa5ae621": 0.01,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a598f1c-e1a8-11ea-b0ad-008cfa5ae621": 10,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5c6b7e-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06ccec86-e1aa-11ea-8c63-008cfa5ae621": 1,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cba4b6-e1aa-11ea-8c63-008cfa5ae621": 200000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5cde56-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a8be2-e1a8-11ea-b0ad-008cfa5ae621": 25,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cbec32-e1aa-11ea-8c63-008cfa5ae621": 5000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a51f8ce-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/parents/SHOREmap_created_F2Pab_specific.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a616688-e1a8-11ea-b0ad-008cfa5ae621":
                    "outcross",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f572996-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a0bae-e1a8-11ea-b0ad-008cfa5ae621": 80,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cc3728-e1aa-11ea-8c63-008cfa5ae621": 0.99,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56924c-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5bf144-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a4b7bd4-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f5783fa-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd7d54-e1aa-11ea-8c63-008cfa5ae621": 1,
            },
            name: "SHOREmap-outcross-v3.8_analysis1",
            app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "e04bb9e1-a1ad-48fc-b2d1-2a6f9d41a300",
        name: "EMS07-MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
        app_version_id: "8c9a1de0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5b7dcc-e1a8-11ea-b0ad-008cfa5ae621": 5,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f57c798-ed6a-11ea-b188-008cfa5ae621": false,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56e602-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd345c-e1aa-11ea-8c63-008cfa5ae621": 0.01,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a598f1c-e1a8-11ea-b0ad-008cfa5ae621": 10,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5c6b7e-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06ccec86-e1aa-11ea-8c63-008cfa5ae621": 1,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cba4b6-e1aa-11ea-8c63-008cfa5ae621": 200000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5cde56-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a8be2-e1a8-11ea-b0ad-008cfa5ae621": 25,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cbec32-e1aa-11ea-8c63-008cfa5ae621": 5000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a51f8ce-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/parents/SHOREmap_created_F2Pab_specific.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a616688-e1a8-11ea-b0ad-008cfa5ae621":
                    "outcross",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f572996-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a0bae-e1a8-11ea-b0ad-008cfa5ae621": 80,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cc3728-e1aa-11ea-8c63-008cfa5ae621": 0.99,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56924c-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5bf144-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a4b7bd4-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f5783fa-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd7d54-e1aa-11ea-8c63-008cfa5ae621": 1,
            },
            name: "SHOREmap-outcross-v3.8_analysis1",
            app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "61c64201-0517-4dfa-9e98-63b4c1766b7d",
        name: "MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "ab77715c-e1aa-11ea-81c1-008cfa5ae621",
        app_version_id: "8c9a26e6-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_ab805e2a-e1aa-11ea-81c1-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_e737f346-e1ab-11ea-81c1-008cfa5ae621":
                    "",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_e7383d06-e1ab-11ea-81c1-008cfa5ae621":
                    "",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_e7387c30-e1ab-11ea-81c1-008cfa5ae621":
                    "",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_e738d6ee-e1ab-11ea-81c1-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/TAIR10_chr_all.fas",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_e73980d0-e1ab-11ea-81c1-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/TAIR10_GFF3_genes.gff",
                "ab782534-e1aa-11ea-81c1-008cfa5ae621_ab883884-e1aa-11ea-81c1-008cfa5ae621":
                    "annotate",
            },
            name: "SHOREmap-annotate-v3.8_analysis1",
            app_id: "ab77715c-e1aa-11ea-81c1-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "5b3aa5d9-4b68-4ccf-b42c-bab2b039101b",
        name: "EMS01-MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
        app_version_id: "8c9a1de0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5b7dcc-e1a8-11ea-b0ad-008cfa5ae621": 5,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f57c798-ed6a-11ea-b188-008cfa5ae621": false,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56e602-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd345c-e1aa-11ea-8c63-008cfa5ae621": 0.04,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a598f1c-e1a8-11ea-b0ad-008cfa5ae621": 5,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5c6b7e-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06ccec86-e1aa-11ea-8c63-008cfa5ae621": 1,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cba4b6-e1aa-11ea-8c63-008cfa5ae621": 200000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5cde56-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a8be2-e1a8-11ea-b0ad-008cfa5ae621": 20,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cbec32-e1aa-11ea-8c63-008cfa5ae621": 5000,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a51f8ce-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/parents/SHOREmap_created_F2Pab_specific.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a616688-e1a8-11ea-b0ad-008cfa5ae621":
                    "outcross",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f572996-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5a0bae-e1a8-11ea-b0ad-008cfa5ae621": 80,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cc3728-e1aa-11ea-8c63-008cfa5ae621": 0.976,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f56924c-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a5bf144-e1a8-11ea-b0ad-008cfa5ae621":
                    "",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_2a4b7bd4-e1a8-11ea-b0ad-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/chrSizes.txt",
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_4f5783fa-ed6a-11ea-b188-008cfa5ae621": true,
                "2a43bf52-e1a8-11ea-b0ad-008cfa5ae621_06cd7d54-e1aa-11ea-8c63-008cfa5ae621": 1,
            },
            name: "SHOREmap-outcross-v3.8_analysis1",
            app_id: "2a42cdc2-e1a8-11ea-b0ad-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "62cc76fc-0fff-44ce-96f9-e6a9fb3bf709",
        name: "MCB160L",
        description: "",
        creator: "jnmaloof@iplantcollaborative.org",
        app_id: "4056c33a-2603-11eb-96f1-008cfa5ae621",
        app_version_id: "8c98b248-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79819446-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79864946-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_587839a0-e7e0-11ea-a750-008cfa5ae621": false,
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b72d51b8-1fcd-11eb-9970-008cfa5ae621":
                    "bcftools_call_output.vcf",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7983d15c-e96d-11ea-b922-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "uncompressed VCF",
                        id: "798460b8-e96d-11ea-b922-008cfa5ae621",
                        name: "-O",
                        value: "v",
                    },
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b73c95d8-1fcd-11eb-9970-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_797f2472-e96d-11ea-b922-008cfa5ae621": false,
                "40593796-2603-11eb-96f1-008cfa5ae621_d638fdfa-e1ac-11ea-8616-008cfa5ae621":
                    "",
                "40593796-2603-11eb-96f1-008cfa5ae621_dbc64ce0-e1ad-11ea-8bb1-008cfa5ae621": false,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7984de80-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7980052c-e96d-11ea-b922-008cfa5ae621":
                    "/iplant/home/sharmer/mcb160L/reference/TAIR10_chr_all.fas",
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b734f40e-1fcd-11eb-9970-008cfa5ae621": true,
                "40593796-2603-11eb-96f1-008cfa5ae621_dbc6eeb6-e1ad-11ea-8bb1-008cfa5ae621": false,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79851350-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_797fc63e-e96d-11ea-b922-008cfa5ae621":
                    "",
                "40593796-2603-11eb-96f1-008cfa5ae621_dbc6a08c-e1ad-11ea-8bb1-008cfa5ae621": false,
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b7369066-1fcd-11eb-9970-008cfa5ae621": false,
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b73570c8-1fcd-11eb-9970-008cfa5ae621":
                    "",
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b736ffc4-1fcd-11eb-9970-008cfa5ae621": false,
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b72e54c8-1fcd-11eb-9970-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Uncompressed VCF",
                        id: "b72ec7e6-1fcd-11eb-9970-008cfa5ae621",
                        name: "-O",
                        value: "v",
                    },
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b73c3a34-1fcd-11eb-9970-008cfa5ae621":
                    "",
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b73ba0ec-1fcd-11eb-9970-008cfa5ae621":
                    {
                        isDefault: true,
                        display: "Multiallelic caller",
                        id: "b73bbfbe-1fcd-11eb-9970-008cfa5ae621",
                        name: "-m",
                        value: "",
                    },
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79816138-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7979d18e-e96d-11ea-b922-008cfa5ae621":
                    [],
                "40593796-2603-11eb-96f1-008cfa5ae621_d6406a5e-e1ac-11ea-8616-008cfa5ae621":
                    "convert",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7985d632-e96d-11ea-b922-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_7986134a-e96d-11ea-b922-008cfa5ae621":
                    "",
                "40593796-2603-11eb-96f1-008cfa5ae621_dbc5907a-e1ad-11ea-8bb1-008cfa5ae621": 0.2,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79858164-e96d-11ea-b922-008cfa5ae621": false,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_797af55a-e96d-11ea-b922-008cfa5ae621": false,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_797f89b2-e96d-11ea-b922-008cfa5ae621":
                    "",
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b737712a-1fcd-11eb-9970-008cfa5ae621": false,
                "40590b5e-2603-11eb-96f1-008cfa5ae621_b73ceb5a-1fcd-11eb-9970-008cfa5ae621":
                    "",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79834746-e96d-11ea-b922-008cfa5ae621":
                    "BCFtools-mpileupout.vcf",
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_79854a5a-e96d-11ea-b922-008cfa5ae621":
                    "",
                "40593796-2603-11eb-96f1-008cfa5ae621_dbc7379a-e1ad-11ea-8bb1-008cfa5ae621": 3,
                "4058ce8c-2603-11eb-96f1-008cfa5ae621_9a82d120-ebc8-11ea-964b-008cfa5ae621": false,
            },
            name: "BAM-to-SHOREmap3.8_analysis1",
            app_id: "4056c33a-2603-11eb-96f1-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jnmaloof/analyses",
            notify: true,
        },
    },
    {
        id: "3125ee9a-9f0c-4f4c-8efd-aa6f7ea00405",
        name: "cyverse-learning-center",
        description: "",
        creator: "williams@iplantcollaborative.org",
        app_id: "8eb1291c-34ea-11eb-b90c-008cfa5ae621",
        app_version_id: "8c9319d2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "RStudio_Sleuth_analysis1",
            app_id: "8eb1291c-34ea-11eb-b90c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/williams/analyses",
            notify: true,
        },
    },
    {
        id: "30ec1098-f436-4ae2-b5e5-6c27c2d7a539",
        name: "Ruchika Bhat",
        description: "",
        creator: "ruchikabhat@iplantcollaborative.org",
        app_id: "6831ffa0-f521-11e9-bd69-008cfa5ae621",
        app_version_id: "8c861fd4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "seurat_analysis1",
            app_id: "6831ffa0-f521-11e9-bd69-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/ruchikabhat/analyses",
            notify: true,
        },
    },
    {
        id: "d92e1b51-c4b7-40d7-8beb-bed5ec84acca",
        name: "flowspace",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "c42966aa-47a4-11eb-8a70-008cfa5ae621",
        app_version_id: "8c9a0ada-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {},
            name: "flowspace_analysis1",
            app_id: "c42966aa-47a4-11eb-8a70-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "78f1fecf-327c-46e2-87be-d8c99b59ceef",
        name: "ffd",
        description: "",
        creator: "wewe22@iplantcollaborative.org",
        app_id: "1d35dc48-eb93-11e9-b6b7-008cfa5ae621",
        app_version_id: "8c8e44c0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "1d36a1c8-eb93-11e9-b6b7-008cfa5ae621_1d38b79c-eb93-11e9-b6b7-008cfa5ae621":
                    "",
            },
            name: "Jupyter-SciPy_Planet_Labs_analysis1",
            app_id: "1d35dc48-eb93-11e9-b6b7-008cfa5ae621",
            system_id: "de",
            debug: true,
            output_dir: "/iplant/home/wewe22/analyses",
            notify: true,
        },
    },
    {
        id: "c9d3dbbb-849f-4981-92fb-275cc2257971",
        name: "HWtest",
        description: "",
        creator: "lmcguire@iplantcollaborative.org",
        app_id: "c940912c-fcea-11ea-b07f-008cfa5ae621",
        app_version_id: "8c9a3118-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "c9410cb0-fcea-11ea-b07f-008cfa5ae621_c9439228-fcea-11ea-b07f-008cfa5ae621":
                    [],
            },
            name: "Jupyter_Lab_Geospatial_analysis1",
            app_id: "c940912c-fcea-11ea-b07f-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/lmcguire/analyses",
            notify: true,
        },
    },
    {
        id: "f8535402-e188-4e82-bf4a-6369a9ee9ac2",
        name: "IntrotoRModule_GeneticIncompatibility",
        description: "",
        creator: "kbkubow@iplantcollaborative.org",
        app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
        app_version_id: "8c99aef0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15084884-e7e2-11ea-a750-008cfa5ae621":
                    [
                        "/iplant/home/kbkubow/CampanulaGeneticIncompatibilityC.Rmd",
                        "/iplant/home/kbkubow/CampanulaSurvivalData.csv",
                    ],
            },
            name: "Rocker_RStudio_TidyVerse_v3.6.3_analysis1",
            app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/kbkubow/analyses",
            notify: true,
        },
    },
    {
        id: "960cdca9-f6d4-4e53-88f7-0f587232bc1b",
        name: "workspace-geospatial",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "580bbc6e-161e-11eb-880c-008cfa5ae621",
        app_version_id: "8c931022-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "580c8554-161e-11eb-880c-008cfa5ae621_5810d0fa-161e-11eb-880c-008cfa5ae621":
                    [],
            },
            name: "Workspace_Geospatial_analysis1",
            app_id: "580bbc6e-161e-11eb-880c-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "89643839-97da-4567-98ac-3e860400af27",
        name: "rstudio-tidymodels:v1.0",
        description: "",
        creator: "arutherford@iplantcollaborative.org",
        app_id: "2d7fcfa6-6af8-11eb-9f9e-008cfa5ae621",
        app_version_id: "8c735520-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "2d80aafc-6af8-11eb-9f9e-008cfa5ae621_2d84fecc-6af8-11eb-9f9e-008cfa5ae621":
                    "",
                "2d80aafc-6af8-11eb-9f9e-008cfa5ae621_2d85c762-6af8-11eb-9f9e-008cfa5ae621":
                    "",
                "2d80aafc-6af8-11eb-9f9e-008cfa5ae621_2d869ce6-6af8-11eb-9f9e-008cfa5ae621":
                    "",
            },
            name: "rstudio-tidymodels_analysis1",
            app_id: "2d7fcfa6-6af8-11eb-9f9e-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/arutherford/analyses",
            notify: true,
        },
    },
    {
        id: "da60c3cb-2937-4469-9956-9f88c28d0c5d",
        name: "Quick Launch",
        description: "",
        creator: "josephacevedo@iplantcollaborative.org",
        app_id: "c80b8afc-e758-11ea-b934-008cfa5ae621",
        app_version_id: "8c99b99a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "ADEPTLab_analysis1",
            app_id: "c80b8afc-e758-11ea-b934-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/josephacevedo/analyses",
            notify: true,
        },
    },
    {
        id: "ac9bb270-258a-4551-a0fb-9863576cc067",
        name: "Xpra Desktop Ubuntu 20.04",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "c819820c-6b28-11eb-b919-008cfa5ae621",
        app_version_id: "8c793b3e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "c81a14e2-6b28-11eb-b919-008cfa5ae621_c81d6dcc-6b28-11eb-b919-008cfa5ae621":
                    [],
            },
            name: "Xpra_Desktop_20.04_analysis1",
            app_id: "c819820c-6b28-11eb-b919-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "f11f8eff-81e6-4b9c-a796-0a39b628dcaf",
        name: "Test",
        description: "",
        creator: "chrisweber@iplantcollaborative.org",
        app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
        app_version_id: "8c99aef0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15084884-e7e2-11ea-a750-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_TidyVerse_v3.6.3_analysis1",
            app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/chrisweber/analyses",
            notify: false,
        },
    },
    {
        id: "57d66100-eed3-448d-861f-e419fbda1100",
        name: "John",
        description: "",
        creator: "jjamesahn@iplantcollaborative.org",
        app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
        app_version_id: "8c99a612-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "a8b2948e-e6f4-11ea-844a-008cfa5ae621_a8bdcc50-e6f4-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_3.6.3_analysis1",
            app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/jjamesahn/analyses",
            notify: true,
        },
    },
    {
        id: "b57269ef-c6cc-43de-a2d9-e2398e53536e",
        name: "JupyterLab Geospatial 2.2.9",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "5eb08814-6b1a-11eb-9180-008cfa5ae621",
        app_version_id: "8c989894-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "5eb10712-6b1a-11eb-9180-008cfa5ae621_5eb399a0-6b1a-11eb-9180-008cfa5ae621":
                    [],
            },
            name: "JupyterLab_Geospatial_2.2.9_analysis1",
            app_id: "5eb08814-6b1a-11eb-9180-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "fd9b32a3-434f-4b96-939e-1dabaa69ffba",
        name: "Network_analysis_webinar",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
        app_version_id: "8c75b40a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ccb09eec-6c8e-11eb-94c7-008cfa5ae621_ccb6f864-6c8e-11eb-94c7-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Network_analysis_webinar/Webinar-NetworkAnalysis",
            },
            name: "Jupyterlab-GraphViz_analysis1",
            app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "98fe2e12-e2fc-48bd-a2ed-2f6eaa3d41ce",
        name: "Webinar1",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
        app_version_id: "8c75b40a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "ccb09eec-6c8e-11eb-94c7-008cfa5ae621_ccb6f864-6c8e-11eb-94c7-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Network_analysis_webinar/Webinar-NetworkAnalysis",
            },
            name: "Jupyterlab-GraphViz_analysis1",
            app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "605c2c98-a00c-4412-9fe6-102005b6c390",
        name: "sfdp_demo",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
        app_version_id: "8c75b40a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "ccb09eec-6c8e-11eb-94c7-008cfa5ae621_ccb6f864-6c8e-11eb-94c7-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/Network_analysis_webinar/demo",
            },
            name: "Jupyterlab-GraphViz_analysis1",
            app_id: "ccb0264c-6c8e-11eb-94c7-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "dd289adc-996f-4e96-8022-f24c5bd0e597",
        name: "terry andrews",
        description: "",
        creator: "terryandrews@iplantcollaborative.org",
        app_id: "74d44974-e93d-11e9-8c4d-008cfa5ae621",
        app_version_id: "8c6eff66-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "74d50c24-e93d-11e9-8c4d-008cfa5ae621_74d6e9ae-e93d-11e9-8c4d-008cfa5ae621":
                    [],
            },
            name: "genepattern-notebook_analysis1",
            app_id: "74d44974-e93d-11e9-8c4d-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/terryandrews/analyses",
            notify: false,
        },
    },
    {
        id: "31dcb760-f872-4c1a-850a-a4a6a25febc4",
        name: "EMSI Rmd 3.6.3",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "6943b4f2-b663-11ea-92c5-008cfa5ae621",
        app_version_id: "8c7a780a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "6944aad8-b663-11ea-92c5-008cfa5ae621_694bcc46-b663-11ea-92c5-008cfa5ae621":
                    "/iplant/home/tswetnam/emsi/rmd",
            },
            name: "Rocker_RStudio_Geospatial_3.6.3_analysis1",
            app_id: "6943b4f2-b663-11ea-92c5-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "a5d7055d-e00a-4d11-bade-2dfa562a2219",
        name: "swift_sarscov2_v2",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "8da06d66-9981-11eb-960a-008cfa5ae621",
        app_version_id: "8c8d020e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "8da14010-9981-11eb-960a-008cfa5ae621_811359e4-9bb8-11eb-80e3-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/swift_sarscov2_ref_genomes",
                "8da14010-9981-11eb-960a-008cfa5ae621_f7c45566-9bc7-11eb-a55e-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/swift_sarscov2_scripts/run_swift_sarscov2_conda.sh",
                "8da14010-9981-11eb-960a-008cfa5ae621_f7c5377e-9bc7-11eb-a55e-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/swift_sarscov2_scripts/sarscov2_v2_masterfile.txt",
                "8da14010-9981-11eb-960a-008cfa5ae621_f7c60f6e-9bc7-11eb-a55e-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/swift_sarscov2_scripts/swift_sarscov2_cyverse.ipynb",
                "8da14010-9981-11eb-960a-008cfa5ae621_8da50628-9981-11eb-960a-008cfa5ae621":
                    [],
            },
            name: "swift_sarscov2_analysis_analysis1",
            app_id: "8da06d66-9981-11eb-960a-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "15b8cf0b-56ee-4355-bb90-a1c36f303dd5",
        name: "Princeton-Launch",
        description: "",
        creator: "sriram@iplantcollaborative.org",
        app_id: "d99d9cc6-4672-11e8-81e9-008cfa5ae621",
        app_version_id: "8c913522-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "d99e044a-4672-11e8-81e9-008cfa5ae621_d9a3f7d8-4672-11e8-81e9-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/classrooms/princeton/MOL214/Data/hlh-2/experimental_design.tsv",
                "d99e044a-4672-11e8-81e9-008cfa5ae621_d9a4e7b0-4672-11e8-81e9-008cfa5ae621":
                    "",
                "d99e044a-4672-11e8-81e9-008cfa5ae621_55642ed6-4675-11e8-adf3-008cfa5ae621":
                    "",
                "d99e044a-4672-11e8-81e9-008cfa5ae621_556488d6-4675-11e8-adf3-008cfa5ae621":
                    "",
            },
            name: "Sleuth_analysis1",
            app_id: "d99d9cc6-4672-11e8-81e9-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/sriram/bulk",
            notify: true,
        },
    },
    {
        id: "044c3651-c013-4187-9439-c92d66489ba4",
        name: "PlantCV-workshop-BTI",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "7f504738-e06c-11e9-a622-008cfa5ae621",
        app_version_id: "8c96822a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "7f5110d2-e06c-11e9-a622-008cfa5ae621_7f530d88-e06c-11e9-a622-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/BTI_PlantCV_lesson",
            },
            name: "PlantCV_v3.6.0_analysis1",
            app_id: "7f504738-e06c-11e9-a622-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "f7f67ef5-aed2-4139-8c60-9316b2f63167",
        name: "PlantCV-workshop-BTI",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
        app_version_id: "8c99a612-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "a8b2948e-e6f4-11ea-844a-008cfa5ae621_a8bc6824-e6f4-11ea-844a-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/BTI_PlantCV_lesson",
                "a8b2948e-e6f4-11ea-844a-008cfa5ae621_a8bdcc50-e6f4-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_3.6.3_analysis1",
            app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "a431b1f8-9e12-47dc-88b9-66804b98d256",
        name: "JupyterLab Geospatial 2.2.9 Instant Launch",
        description: "",
        creator: "wregglej@iplantcollaborative.org",
        app_id: "5eb08814-6b1a-11eb-9180-008cfa5ae621",
        app_version_id: "8c989894-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "5eb10712-6b1a-11eb-9180-008cfa5ae621_5eb399a0-6b1a-11eb-9180-008cfa5ae621":
                    [],
            },
            name: "JupyterLab_Geospatial_2.2.9_analysis1",
            app_id: "5eb08814-6b1a-11eb-9180-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/wregglej/analyses",
            notify: true,
        },
    },
    {
        id: "a1b688a5-3d32-4d81-9d15-84951192c95f",
        name: "ipycytoscape",
        description: "",
        creator: "sateeshp@iplantcollaborative.org",
        app_id: "da533b60-aca1-11eb-a5d9-008cfa5ae621",
        app_version_id: "8c9830c0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "da53fc30-aca1-11eb-a5d9-008cfa5ae621_da5773b0-aca1-11eb-a5d9-008cfa5ae621":
                    [],
            },
            name: "ipycytoscape_analysis1",
            app_id: "da533b60-aca1-11eb-a5d9-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/sateeshp/analyses",
            notify: true,
        },
    },
    {
        id: "60054c75-0e80-4169-8a9b-51cba04f756d",
        name: "JupyterLab Datascience 2.2.9",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "07a2d5b2-76e2-11eb-be5f-008cfa5ae621",
        app_version_id: "8c99004a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "07a39ff6-76e2-11eb-be5f-008cfa5ae621_07a7dcce-76e2-11eb-be5f-008cfa5ae621":
                    [],
            },
            name: "JupyterLab_Datascience_2.2.9_analysis1",
            app_id: "07a2d5b2-76e2-11eb-be5f-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "20fd94ff-2ce2-4d34-9084-23e85cb367e7",
        name: "Terrain-API-JupyterLab-Notebooks",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "2a28c7b0-6fc4-11eb-bd2d-008cfa5ae621",
        app_version_id: "8c92a3da-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "2a297e62-6fc4-11eb-bd2d-008cfa5ae621_2a2d79b8-6fc4-11eb-bd2d-008cfa5ae621":
                    [
                        "/iplant/home/shared/cyverse_training/platform_guides/discovery_environment/jupyterlab/terrain-api/terrain-automation.ipynb",
                        "/iplant/home/shared/cyverse_training/platform_guides/discovery_environment/jupyterlab/terrain-api/terrain-intro.ipynb",
                    ],
            },
            name: "Terrain-API-Jupyter-Notebooks",
            app_id: "2a28c7b0-6fc4-11eb-bd2d-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "40558c4a-7440-45b8-9afa-7013601682d4",
        name: "NCIBC_workshop_demo",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "ff799520-5c23-11eb-9cb8-008cfa5ae621",
        app_version_id: "8c97e48a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "ff7a0794-5c23-11eb-9cb8-008cfa5ae621_ff839598-5c23-11eb-9cb8-008cfa5ae621":
                    "/iplant/home/shared/iplantcollaborative/example_data/seurat/Demo_Folder",
            },
            name: "rstudio-seurat_v4.0_analysis1",
            app_id: "ff799520-5c23-11eb-9cb8-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "5a1cc90c-9139-4c9f-838f-0c101392d1cf",
        name: "Rocker RStudio Verse 4.0.0-ubuntu18.04",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "01d05704-a784-11eb-98a3-008cfa5ae621",
        app_version_id: "8c972ea0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "01d10ffa-a784-11eb-98a3-008cfa5ae621_01d503c6-a784-11eb-98a3-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_4.0.0-ubuntu18.04_analysis1",
            app_id: "01d05704-a784-11eb-98a3-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: false,
        },
    },
    {
        id: "758ace16-7629-4d11-a78d-a77666832c1d",
        name: "Rocker RStudio Verse 4.0.5",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "15c46f9e-bb1a-11eb-97db-008cfa5ae621",
        app_version_id: "8c97e94e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "15c5290c-bb1a-11eb-97db-008cfa5ae621_15caf01c-bb1a-11eb-97db-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_4.0.5_analysis1",
            app_id: "15c46f9e-bb1a-11eb-97db-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "dc645017-b1a8-451e-a99c-9030a4bc24e1",
        name: "Rocker RStudio Verse 3.6.3",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
        app_version_id: "8c99a612-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "a8b2948e-e6f4-11ea-844a-008cfa5ae621_a8bdcc50-e6f4-11ea-844a-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_3.6.3_analysis1",
            app_id: "a8b21a2c-e6f4-11ea-844a-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "7dc405b2-88a1-4744-ad1f-13de1c3d27e3",
        name: "RStudio Geospatial 4.0.0",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "2f3f0454-b669-11ea-9581-008cfa5ae621",
        app_version_id: "8c993efc-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "RStudio_Geospatial_4.0.0_analysis1",
            app_id: "2f3f0454-b669-11ea-9581-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "acba1fe9-b4f3-4277-8079-a4269ceff5a6",
        name: "HAMR-1.0",
        description: "",
        creator: "elyons@iplantcollaborative.org",
        app_id: "66758afe-d34e-11ea-ba10-008cfa5ae621",
        app_version_id: "8c997962-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "667675d6-d34e-11ea-ba10-008cfa5ae621_fe32eee8-d82d-11ea-988f-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667ca3f2-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667ce0b0-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_fe32bc0c-d82d-11ea-988f-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667d4e10-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667deee2-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667d140e-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667c418c-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667dbcb0-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667d883a-d34e-11ea-ba10-008cfa5ae621":
                    "",
                "667675d6-d34e-11ea-ba10-008cfa5ae621_667b7aa4-d34e-11ea-ba10-008cfa5ae621":
                    "",
            },
            name: "HAMR-1.0_analysis1",
            app_id: "66758afe-d34e-11ea-ba10-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/elyons/analyses",
            notify: true,
        },
    },
    {
        id: "64f618d7-8a75-4523-9f41-96b037f7d568",
        name: "demo_sfdp",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
        app_version_id: "8c9654d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "bc93f416-d584-11e9-8413-008cfa5ae621_bc9646da-d584-11e9-8413-008cfa5ae621":
                    "/iplant/home/reetu/1_demo_sfdp",
            },
            name: "Jupyter_Lab_SciPy_Notebook_Latest_analysis1",
            app_id: "bc93504c-d584-11e9-8413-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "2195df81-8ff2-4647-89fc-6a0893901e49",
        name: "Demo_data",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "01d05704-a784-11eb-98a3-008cfa5ae621",
        app_version_id: "8c972ea0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "01d10ffa-a784-11eb-98a3-008cfa5ae621_01d3288a-a784-11eb-98a3-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/platform_guides/discovery_environment/rstudio/palmerpenguins",
                "01d10ffa-a784-11eb-98a3-008cfa5ae621_01d503c6-a784-11eb-98a3-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_4.0.0-ubuntu18.04_analysis1",
            app_id: "01d05704-a784-11eb-98a3-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "b2d6dbef-cbf3-425f-8e28-64c9114bc98a",
        name: "Demo_data",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "15c46f9e-bb1a-11eb-97db-008cfa5ae621",
        app_version_id: "8c97e94e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            config: {
                "15c5290c-bb1a-11eb-97db-008cfa5ae621_15c8cfda-bb1a-11eb-97db-008cfa5ae621":
                    "/iplant/home/shared/cyverse_training/platform_guides/discovery_environment/rstudio/palmerpenguins",
                "15c5290c-bb1a-11eb-97db-008cfa5ae621_15caf01c-bb1a-11eb-97db-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_4.0.5_analysis1",
            app_id: "15c46f9e-bb1a-11eb-97db-008cfa5ae621",
            system_id: "de",
            debug: false,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "27836c84-31fd-43ad-a81c-d564d49c5695",
        name: "Mathworks Matlab 2021a",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "478d4c5c-bda5-11eb-9b6c-008cfa5ae621",
        app_version_id: "8c999708-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "478e21cc-bda5-11eb-9b6c-008cfa5ae621_478fed04-bda5-11eb-9b6c-008cfa5ae621":
                    [],
            },
            name: "Mathworks_Matlab_2021a_analysis1",
            app_id: "478d4c5c-bda5-11eb-9b6c-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "f0063599-9dba-406f-8927-1f3ad326f956",
        name: "Rocker RStudio Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "95476bc6-bbe3-11eb-a080-008cfa5ae621",
        app_version_id: "8c9801ae-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "9548269c-bbe3-11eb-a080-008cfa5ae621_954e242a-bbe3-11eb-a080-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Latest_analysis1",
            app_id: "95476bc6-bbe3-11eb-a080-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "83903e33-a47a-4cab-a56c-57817a1104af",
        name: "Rocker RStudio Geospatial Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "07e2b2e6-becd-11e9-b524-008cfa5ae621",
        app_version_id: "8c97fa74-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "Rocker_RStudio_Geospatial_Latest_analysis1",
            app_id: "07e2b2e6-becd-11e9-b524-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: false,
        },
    },
    {
        id: "b726cb41-580e-4847-bb54-78fefed21c72",
        name: "Xpra Ubuntu QGIS",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "bd9aaf14-c55e-11eb-a418-008cfa5ae621",
        app_version_id: "8c79a240-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "bd9b2a34-c55e-11eb-a418-008cfa5ae621_bd9d9a6c-c55e-11eb-a418-008cfa5ae621":
                    [],
            },
            name: "Xpra_Ubuntu_QGIS_analysis1",
            app_id: "bd9aaf14-c55e-11eb-a418-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: false,
        },
    },
    {
        id: "b1fd3182-80f9-41ab-8395-e9ed26d01d7a",
        name: "Xpra Ubuntu QGIS",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "9a133468-d5fc-11eb-9331-008cfa5ae621",
        app_version_id: "8c96b84e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "9a13b8d4-d5fc-11eb-9331-008cfa5ae621_9a19aec4-d5fc-11eb-9331-008cfa5ae621":
                    [],
            },
            name: "Xpra_Ubuntu_QGIS_analysis1",
            app_id: "9a133468-d5fc-11eb-9331-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "4af58c82-d51a-4f6d-87e3-2e0b66e40d50",
        name: "WallaceEcoMod",
        description: "",
        creator: "mlammens@iplantcollaborative.org",
        app_id: "58cec2ae-e9cc-11eb-8c94-008cfa5ae621",
        app_version_id: "8c7e70a4-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "Wallace_analysis1",
            app_id: "58cec2ae-e9cc-11eb-8c94-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/mlammens/analyses",
            notify: true,
        },
    },
    {
        id: "0ec24b82-e0cd-45c6-832d-73780026fafd",
        name: "rrv400",
        description: "",
        creator: "sarahr@iplantcollaborative.org",
        app_id: "cdf7630c-e4fe-11ea-b941-008cfa5ae621",
        app_version_id: "8c99aa04-127a-11ed-9c8c-008cfa5ae621",
        is_public: false,
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
            config: {},
            name: "Rocker_Rstudio_Verse_4.0.0_analysis1",
            app_id: "cdf7630c-e4fe-11ea-b941-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/sarahr/analyses",
            notify: true,
        },
    },
    {
        id: "a2d0aea3-e256-4cd6-bdfc-f243407d2aad",
        name: "Maximum Power",
        description: "",
        creator: "culshawmaurer@iplantcollaborative.org",
        app_id: "7b861122-f556-11eb-bea0-008cfa5ae621",
        app_version_id: "8c8a6710-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            description: "",
            requirements: [
                {
                    min_cpu_cores: 8,
                    min_memory_limit: 17179869184,
                    min_disk_space: 68719476736,
                    step_number: 0,
                },
            ],
            config: {},
            name: "Rocker_RStudio_Stan_latest_analysis1",
            app_id: "7b861122-f556-11eb-bea0-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/culshawmaurer/analyses",
            notify: false,
        },
    },
    {
        id: "755e40db-e623-4756-bd2a-d1c0ebffe97a",
        name: "Xpra Desktop Ubuntu Geospatial 20.04",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
        app_version_id: "8c6a10c8-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "f3f97c36-23d5-11ec-abcf-008cfa5ae621_f3fe835c-23d5-11ec-abcf-008cfa5ae621":
                    [],
            },
            name: "Xpra_Desktop_Ubuntu_Geospatial_20.04_analysis1",
            app_id: "f3f8cc78-23d5-11ec-abcf-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "98b17304-bc38-4114-b950-2134487b71ba",
        name: "zsh",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "087f8024-fdde-11eb-9070-008cfa5ae621",
        app_version_id: "8c96a4b2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "08802434-fdde-11eb-9070-008cfa5ae621_088219ce-fdde-11eb-9070-008cfa5ae621":
                    [],
            },
            name: "zsh_analysis1",
            app_id: "087f8024-fdde-11eb-9070-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "8d9f6e7e-a269-4430-ba7c-5e26ad46c971",
        name: "cli",
        description: "",
        creator: "wregglej@iplantcollaborative.org",
        app_id: "cedd97aa-2841-11ec-ae85-008cfa5ae621",
        app_version_id: "8c9644c2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "cede352a-2841-11ec-ae85-008cfa5ae621_cee8ec2c-2841-11ec-ae85-008cfa5ae621":
                    [],
            },
            name: "bash_analysis1",
            app_id: "cedd97aa-2841-11ec-ae85-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/wregglej/analyses",
            notify: true,
        },
    },
    {
        id: "6f0f6450-622f-43b4-ae2f-ffabc18f9a2d",
        name: "JupyterLab Datascience Latest with RStudio & Shiny",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
        app_version_id: "c222d098-1995-11ed-986c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "JupyterLab_Datascience_Latest_with_RStudio_&_Shiny_analysis1",
            app_id: "c2227314-1995-11ed-986c-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "a86942d4-9cff-48cd-a85b-5e7e66cb6184",
        name: "2021-11-0_Bot960",
        description: "",
        creator: "steveg@iplantcollaborative.org",
        app_id: "3548f43a-bed1-11e9-af16-008cfa5ae621",
        app_version_id: "8c811822-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "3549adbc-bed1-11e9-af16-008cfa5ae621_354c81ae-bed1-11e9-af16-008cfa5ae621":
                    "/iplant/home/rojasbarros/Botany 960 Seminar",
            },
            name: "Rocker_RStudio_Verse_latest_analysis1",
            app_id: "3548f43a-bed1-11e9-af16-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/steveg/analyses",
            notify: false,
        },
    },
    {
        id: "59d76de1-8a5a-41eb-ac5a-960a92646fdc",
        name: "ShunPykeR_pipeline",
        description: "",
        creator: "reetu@iplantcollaborative.org",
        app_id: "8b52f276-a8eb-11eb-adef-008cfa5ae621",
        app_version_id: "8c9795de-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "8b538e84-a8eb-11eb-adef-008cfa5ae621_89dbbd7e-419d-11ec-8d25-008cfa5ae621":
                    "/iplant/home/shared/scRNA-Seq_Working_Group/pipelines/shunPykeR",
                "8b538e84-a8eb-11eb-adef-008cfa5ae621_8b5abf56-a8eb-11eb-adef-008cfa5ae621":
                    "/iplant/home/shared/scRNA-Seq_Working_Group/sample_datasets/hg19",
            },
            name: "JupyterLab-scRNASeq_Notebook_1.0_analysis1",
            app_id: "8b52f276-a8eb-11eb-adef-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/reetu/analyses",
            notify: false,
        },
    },
    {
        id: "d34723d6-f7cc-4fe4-b39b-8b0986e43479",
        name: "Datahog",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
        app_version_id: "8c947b92-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "d0ff2c68-392b-11e9-95ec-008cfa5ae621_d10602d6-392b-11e9-95ec-008cfa5ae621":
                    [],
            },
            name: "Datahog_analysis1",
            app_id: "d0f77e8c-392b-11e9-95ec-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "e6484d73-96ba-4b0f-aba4-cb1fb7c97aea",
        name: "JupyterLab Geospatial Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
        app_version_id: "8c96a9b2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "0bb0e4c0-5d03-11ec-b195-008cfa5ae621_0bb608e2-5d03-11ec-b195-008cfa5ae621":
                    [],
            },
            name: "Jupyter_Lab_Geospatial_Latest_analysis1",
            app_id: "0bb01716-5d03-11ec-b195-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "4ab1f690-f360-4bba-bef9-d22f9f7b82f9",
        name: "JupyterLab Datascience Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
        app_version_id: "8c98385e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "cc78752e-bc45-11eb-9934-008cfa5ae621_cc7e8cc0-bc45-11eb-9934-008cfa5ae621":
                    [],
            },
            name: "JupyterLab_Datascience_Latest_analysis1",
            app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "4dca77f3-fb9c-4c6c-a19a-5288aa546e9b",
        name: "cli",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
        app_version_id: "8c8f2b4c-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "5f2fe3b2-57b3-11ec-8180-008cfa5ae621_5f34244a-57b3-11ec-8180-008cfa5ae621":
                    [],
            },
            name: "Cloud_Shell_analysis1",
            app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "950035a0-c3dc-4639-ab04-f5724be589e1",
        name: "ShinyAppPratiksha",
        description: "",
        creator: "pratikshaj@iplantcollaborative.org",
        app_id: "83656438-7887-11ec-aa2a-008cfa5ae621",
        app_version_id: "8c971fdc-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
            config: {},
            name: "ShinyAppPratiksha_analysis1",
            app_id: "83656438-7887-11ec-aa2a-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/pratikshaj/analyses",
            notify: false,
        },
    },
    {
        id: "f2bc5c33-54ff-4542-aef3-5c24cfcaee33",
        name: "inayat",
        description: "",
        creator: "inayat45shaikh@iplantcollaborative.org",
        app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
        app_version_id: "8c8f2b4c-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
        submission: {
            description: "",
            requirements: [
                {
                    min_cpu_cores: 8,
                    min_memory_limit: 17179869184,
                    min_disk_space: 549755813888,
                    step_number: 0,
                },
            ],
            config: {
                "5f2fe3b2-57b3-11ec-8180-008cfa5ae621_5f34244a-57b3-11ec-8180-008cfa5ae621":
                    [],
            },
            name: "RNA-seq_test",
            app_id: "5f2f1824-57b3-11ec-8180-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/inayat45shaikh/analyses",
            notify: false,
        },
    },
    {
        id: "246ad8a3-04ce-451b-a94a-56ddff8522b2",
        name: "whereRwe?",
        description: "",
        creator: "heidiesteiner@iplantcollaborative.org",
        app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
        app_version_id: "8c99aef0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15070e9c-e7e2-11ea-a750-008cfa5ae621":
                    "/iplant/home/heidiesteiner",
                "1505d4dc-e7e2-11ea-a750-008cfa5ae621_15084884-e7e2-11ea-a750-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_TidyVerse_v3.6.3_analysis1",
            app_id: "1505670e-e7e2-11ea-a750-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/heidiesteiner/analyses",
            notify: false,
        },
    },
    {
        id: "428e3252-f759-48e6-81eb-3778aae2c0a9",
        name: "CHEM430-Ex1",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
        app_version_id: "8c98385e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "cc78752e-bc45-11eb-9934-008cfa5ae621_cc7dc5ba-bc45-11eb-9934-008cfa5ae621":
                    "/iplant/home/tswetnam/CHEM430",
                "cc78752e-bc45-11eb-9934-008cfa5ae621_cc7e8cc0-bc45-11eb-9934-008cfa5ae621":
                    [],
            },
            name: "JupyterLab_Datascience_Latest_analysis1",
            app_id: "cc77b788-bc45-11eb-9934-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "ecc91edf-daf0-48fd-9c2b-e4a4fb7178ce",
        name: "Rocker RStudio Verse (latest)",
        description: "",
        creator: "cosimichele@iplantcollaborative.org",
        app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
        app_version_id: "3b5fc0ec-19a5-11ed-b38a-008cfa5ae621",
        is_public: true,
        submission: {
            description: "",
            requirements: [
                {
                    min_cpu_cores: 0,
                    min_memory_limit: 0,
                    min_disk_space: 0,
                    step_number: 0,
                    max_cpu_cores: 32,
                },
            ],
            config: {},
            name: "Rocker_RStudio_Verse_(latest)_analysis1",
            app_id: "3b5f5b16-19a5-11ed-b38a-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/cosimichele/analyses",
            notify: true,
        },
    },
    {
        id: "298a1d98-9af6-457a-8332-6854f797abdd",
        name: "VS Code",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
        app_version_id: "8c99c9d0-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "091d22b0-4be1-11ec-aad9-008cfa5ae621_fa81348e-8868-11ec-b7ac-008cfa5ae621":
                    [],
            },
            name: "VS_Code_analysis1",
            app_id: "091c830a-4be1-11ec-aad9-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "49bd4b31-a697-44c5-aea9-bf3851f2011f",
        name: "RStudio Geospatial Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
        app_version_id: "8c983200-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "5f00ecaa-7e10-11ec-a9b0-008cfa5ae621_5f073d1c-7e10-11ec-a9b0-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Geospatial_Latest_analysis1",
            app_id: "5f002d10-7e10-11ec-a9b0-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "3f671b8b-c3aa-4b59-a062-3ec2820cb571",
        name: "Microbiome_16s",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "dbf350c6-7c68-11ec-9ba1-008cfa5ae621",
        app_version_id: "8c979bec-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "dbf41272-7c68-11ec-9ba1-008cfa5ae621_dbf6763e-7c68-11ec-9ba1-008cfa5ae621":
                    "/iplant/home/shared/SUNBEAM_ABC/Welcome_Files/Welcome_microbiome16s_preprocessing.Rmd",
            },
            name: "Sunbeam_Microbiome_(16s)_Data_Processing_analysis1",
            app_id: "dbf350c6-7c68-11ec-9ba1-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "bf5936bc-e539-44db-a612-71ec01d88b32",
        name: "RStudio Verse Latest",
        description: "",
        creator: "tswetnam@iplantcollaborative.org",
        app_id: "48b6e7ae-8b64-11ec-92dc-008cfa5ae621",
        app_version_id: "8c97fe16-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "48b78588-8b64-11ec-92dc-008cfa5ae621_48c12b1a-8b64-11ec-92dc-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_Latest_analysis1",
            app_id: "48b6e7ae-8b64-11ec-92dc-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/tswetnam/analyses",
            notify: true,
        },
    },
    {
        id: "cf68c8b4-5cb1-43f8-98e8-e11d63dc80f3",
        name: "Epigenetic_and_Microbiome_Data_integration_Analysis",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "3779fe22-8e75-11ec-8dff-008cfa5ae621",
        app_version_id: "8c99b454-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "377a8950-8e75-11ec-8dff-008cfa5ae621_37835d3c-8e75-11ec-8dff-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS/Welcomefiles/Welcome_epigenetic_microbiome_integration.Rmd",
                "377a8950-8e75-11ec-8dff-008cfa5ae621_37848ff4-8e75-11ec-8dff-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS",
                "377a8950-8e75-11ec-8dff-008cfa5ae621_37859d9a-8e75-11ec-8dff-008cfa5ae621":
                    [],
            },
            name: "BEAMS_Epigenetic_and_Microbiome_Data_Integration_and_Analysis_analysis1",
            app_id: "3779fe22-8e75-11ec-8dff-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "dd91c54c-062a-46e2-b95a-bc516269b45a",
        name: "Epigenetics_Processing",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "1394fd36-8e75-11ec-a611-008cfa5ae621",
        app_version_id: "8c999e6a-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "1395aa4c-8e75-11ec-a611-008cfa5ae621_139ce410-8e75-11ec-a611-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS/Welcomefiles/Welcome_epigenetic_preprocessing.Rmd",
                "1395aa4c-8e75-11ec-a611-008cfa5ae621_139e4e18-8e75-11ec-a611-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS",
                "1395aa4c-8e75-11ec-a611-008cfa5ae621_139f996c-8e75-11ec-a611-008cfa5ae621":
                    [],
            },
            name: "BEAMS_Epigenetics_Data_Processing_analysis1",
            app_id: "1394fd36-8e75-11ec-a611-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "8c3591bd-9a90-44ed-bfac-137ab6950322",
        name: "Microbiome_Processing",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "f62d9e9c-8e74-11ec-a611-008cfa5ae621",
        app_version_id: "8c999d3e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "f62e3014-8e74-11ec-a611-008cfa5ae621_f6352acc-8e74-11ec-a611-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS/Welcomefiles/Welcome_microbiome16s_preprocessing.Rmd",
                "f62e3014-8e74-11ec-a611-008cfa5ae621_f636f244-8e74-11ec-a611-008cfa5ae621":
                    "/iplant/home/joelparkeruofa/BEAMS",
            },
            name: "BEAMS_Microbiome_(16s)_Data_Processing_analysis1",
            app_id: "f62d9e9c-8e74-11ec-a611-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "95409dc4-fda0-48f8-b844-161a62a5585e",
        name: "shunPykerR",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "b5c42f48-91ac-11ec-8d5d-008cfa5ae621",
        app_version_id: "8c72e5c2-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "b5c4d236-91ac-11ec-8d5d-008cfa5ae621_b5cba836-91ac-11ec-8d5d-008cfa5ae621":
                    "/iplant/home/shared/scRNA-Seq_Working_Group/pipelines/shunPykeR",
                "b5c4d236-91ac-11ec-8d5d-008cfa5ae621_b5cdf8de-91ac-11ec-8d5d-008cfa5ae621":
                    "/iplant/home/shared/scRNA-Seq_Working_Group/pipelines/shunPykeR/shunPyker2.ipynb",
                "b5c4d236-91ac-11ec-8d5d-008cfa5ae621_b5cf0d78-91ac-11ec-8d5d-008cfa5ae621":
                    "/iplant/home/shared/scRNA-Seq_Working_Group/sample_datasets/hg19",
            },
            name: "Joels_Copy_of_JupyterLab-scRNASeq_Notebook_1.0_analysis1",
            app_id: "b5c42f48-91ac-11ec-8d5d-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "1bbf8c98-a3de-4f7b-a33b-1fbf89beb51f",
        name: "Epigenetics",
        description: "",
        creator: "joelparkeruofa@iplantcollaborative.org",
        app_id: "f8fa049e-7c86-11ec-b5cf-008cfa5ae621",
        app_version_id: "8c97bf6e-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "f8faa9b2-7c86-11ec-b5cf-008cfa5ae621_f8fc7e86-7c86-11ec-b5cf-008cfa5ae621":
                    "/iplant/home/shared/SUNBEAM_ABC/Welcome_Files/Welcome_epigenetic_preprocessing.Rmd",
                "f8faa9b2-7c86-11ec-b5cf-008cfa5ae621_f8fe50c6-7c86-11ec-b5cf-008cfa5ae621":
                    [],
            },
            name: "Sunbeam_Epigenetics_Data_Processing_analysis1",
            app_id: "f8fa049e-7c86-11ec-b5cf-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/joelparkeruofa/analyses",
            notify: false,
        },
    },
    {
        id: "09d152f8-fc93-4620-affe-6c301fa0b204",
        name: "Rocker Verse + storms data",
        description: "",
        creator: "culshawmaurer@iplantcollaborative.org",
        app_id: "48b6e7ae-8b64-11ec-92dc-008cfa5ae621",
        app_version_id: "8c97fe16-127a-11ed-9c8c-008cfa5ae621",
        is_public: true,
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
                "48b78588-8b64-11ec-92dc-008cfa5ae621_48be8efa-8b64-11ec-92dc-008cfa5ae621":
                    "/iplant/home/culshawmaurer/data/storms_by_year",
                "48b78588-8b64-11ec-92dc-008cfa5ae621_48c12b1a-8b64-11ec-92dc-008cfa5ae621":
                    [],
            },
            name: "Rocker_RStudio_Verse_Latest_analysis1",
            app_id: "48b6e7ae-8b64-11ec-92dc-008cfa5ae621",
            system_id: "de",
            debug: false,
            create_output_subdir: true,
            output_dir: "/iplant/home/culshawmaurer/analyses",
            notify: false,
        },
    },
];

export const filetypeList = {
    types: [
        "ace",
        "bam",
        "bash",
        "bed",
        "bedgz",
        "bigbed",
        "bigwig",
        "blast",
        "bowtie",
        "clustalw",
        "codata",
        "csh",
        "csv",
        "embl",
        "fasta",
        "fastq",
        "fastxy",
        "game",
        "gcg",
        "gcgblast",
        "gcgfasta",
        "gde",
        "genbank",
        "genscan",
        "gff",
        "gtf",
        "hmmer",
        "ht-analysis-path-list",
        "jar",
        "mase",
        "mega",
        "msf",
        "multi-input-path-list",
        "newick",
        "nexml",
        "nexus",
        "pdf",
        "perl",
        "phylip",
        "phyloxml",
        "pir",
        "prodom",
        "python",
        "rsf",
        "selex",
        "sff",
        "sh",
        "stockholm",
        "swiss",
        "tcsh",
        "tsv",
        "vcf",
        "vcfgz",
        "zip",
    ],
};
