const testData = {
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

it("test data exists", () =>
    expect(testData.deployments.length).toBeGreaterThan(0));

export default testData;
