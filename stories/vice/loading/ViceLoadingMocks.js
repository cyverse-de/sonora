export const urlReadyMock = {
    ready: false,
};

export const statusMock = (uploadComplete, podsComplete) => {
    return {
        deployments: [
            {
                name: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:02 -0700 MST",
                image: "gims.cyverse.org:5000/fastqe-cyverse-vice:1.0",
                command: null,
                port: 8888,
                user: 1000,
                group: 1000,
            },
        ],
        pods: [
            {
                name: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57-84f7f5c9cf-h2b6s",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:02 -0700 MST",
                phase: podsComplete ? "Running" : "Pending",
                message: "",
                reason: "",
                containerStatuses: [
                    {
                        name: "analysis",
                        state: podsComplete
                            ? {
                                  running: {
                                      startedAt: "2021-02-23T00:07:34Z",
                                  },
                              }
                            : { waiting: { reason: "PodInitializing" } },
                        lastState: {},
                        ready: podsComplete, // it's possible for this to be false while running
                        restartCount: 0,
                        image: "gims.cyverse.org:5000/fastqe-cyverse-vice:1.0",
                        imageID: "",
                        started: false,
                    },
                    {
                        name: "input-files",
                        state: podsComplete
                            ? {
                                  running: {
                                      startedAt: "2021-02-23T00:07:34Z",
                                  },
                              }
                            : { waiting: { reason: "PodInitializing" } },
                        lastState: {},
                        ready: podsComplete,
                        restartCount: 0,
                        image: "discoenv/vice-file-transfers:qa",
                        imageID: "",
                        started: false,
                    },
                    {
                        name: "vice-proxy",
                        state: podsComplete
                            ? {
                                  running: {
                                      startedAt: "2021-02-23T00:07:34Z",
                                  },
                              }
                            : { waiting: { reason: "PodInitializing" } },
                        lastState: {},
                        ready: podsComplete,
                        restartCount: 0,
                        image: "discoenv/vice-proxy:qa",
                        imageID: "",
                        started: false,
                    },
                ],
                initContainerStatuses: [
                    {
                        name: "input-files-init",
                        state: uploadComplete
                            ? {
                                  terminated: {
                                      exitCode: 0,
                                      reason: "Completed",
                                      startedAt: "2021-02-22T16:40:08Z",
                                      finishedAt: "2021-02-22T16:40:17Z",
                                      containerID:
                                          "docker://0e4894febe2a431036b8b220c1dfef80b46510eeb6596f121e6451b3c59abe29",
                                  },
                              }
                            : {
                                  running: {
                                      startedAt: "2021-02-22T17:02:01Z",
                                  },
                              },

                        lastState: {},
                        ready: !!uploadComplete,
                        restartCount: 0,
                        image: "discoenv/vice-file-transfers:qa",
                        imageID:
                            "docker-pullable://discoenv/vice-file-transfers@sha256:142ebbace0327df6d68f1af42a7edd78482c9f1f1db3f85f678aece044b00a38",
                        containerID:
                            "docker://0e4894febe2a431036b8b220c1dfef80b46510eeb6596f121e6451b3c59abe29",
                    },
                ],
            },
        ],
        configMaps: [
            {
                name: "excludes-file-a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:01 -0700 MST",
                data: { "excludes-file": "notebooks/\ndata/\nlogs\n" },
            },
            {
                name: "input-path-list-a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:01 -0700 MST",
                data: {
                    "input-path-list":
                        "# application/vnd.de.multi-input-path-list+csv; version=1\n/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/notebooks/\n/iplant/home/shared/cyverse_training/classrooms/renkejhsph/fastqe/data/\n",
                },
            },
        ],
        services: [
            {
                name: "vice-a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:03 -0700 MST",
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
            },
        ],
        ingresses: [
            {
                name: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                namespace: "vice-apps",
                analysisName: "jupyter-fastqe-analysis",
                appName: "jupyter-fastqe",
                appID: "0d933d80-7b3a-11ea-846b-008cfa5ae621",
                externalID: "a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                userID: "b7e7005e-7118-11e5-81e7-93573555eb71",
                username: "ipcdev",
                creationTimestamp: "2021-02-22 09:40:04 -0700 MST",
                defaultBackend: "vice-default-backend:80",
                rules: [
                    {
                        host: "af203cc64",
                        http: {
                            paths: [
                                {
                                    backend: {
                                        serviceName:
                                            "vice-a37abcf1-2cc9-4004-a9c5-7179d5d3ee57",
                                        servicePort: 60000,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
};
