export const urlReadyMock = {
    ready: false,
};

export const POD_STATUS = {
    DONE: "done",
    RUNNING: "running",
    TERMINATED: "error",
    WAITING_ERROR: "waitingError",
    WAITING_INIT: "waitingInit",
};

export const statusMock = (
    deploymentComplete,
    serviceComplete,
    ingressComplete,
    configMapsComplete,
    uploadStatus,
    viceProxyPodComplete,
    inputFilesPodComplete,
    analysisPodStatus
) => {
    return {
        deployments: deploymentComplete && [
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
                phase:
                    viceProxyPodComplete &&
                    inputFilesPodComplete &&
                    (analysisPodStatus === POD_STATUS.RUNNING ||
                        analysisPodStatus === POD_STATUS.DONE)
                        ? "Running"
                        : "Pending",
                message: "",
                reason: "",
                containerStatuses: [
                    {
                        name: "analysis",
                        state:
                            analysisPodStatus === POD_STATUS.WAITING_INIT
                                ? {
                                      waiting: {
                                          reason: "PodInitializing",
                                      },
                                  }
                                : analysisPodStatus === POD_STATUS.WAITING_ERROR
                                ? {
                                      waiting: {
                                          reason: "CrashLoopBackOff",
                                          message:
                                              "back-off 10s restarting failed container=analysis pod=815b346d-fb00-48bb-96a7-c6d78416c9bb-bcf955fdf-87lks_vice-apps(8f565efd-6b78-43b1-8705-9f53745f1bf0)",
                                      },
                                  }
                                : analysisPodStatus === POD_STATUS.TERMINATED
                                ? {
                                      terminated: {
                                          exitCode: 127,
                                          reason: "Error",
                                          startedAt: "2021-03-01T22:48:41Z",
                                          finishedAt: "2021-03-01T22:48:41Z",
                                          containerID:
                                              "docker://b6b06372c472fba06ad593d2a90237b1a5ba33f5a434f0508a5468e249e24296",
                                      },
                                  }
                                : {
                                      running: {
                                          startedAt: "2021-02-22T17:02:01Z",
                                      },
                                  },
                        lastState: {},
                        ready:
                            analysisPodStatus === POD_STATUS.RUNNING ||
                            analysisPodStatus === POD_STATUS.DONE, // it's possible for this to be false while running
                        restartCount: 0,
                        image: "gims.cyverse.org:5000/fastqe-cyverse-vice:1.0",
                        imageID: "",
                        started: false,
                    },
                    {
                        name: "input-files",
                        state: inputFilesPodComplete
                            ? {
                                  running: {
                                      startedAt: "2021-02-23T00:07:34Z",
                                  },
                              }
                            : { waiting: { reason: "PodInitializing" } },
                        lastState: {},
                        ready: inputFilesPodComplete,
                        restartCount: 0,
                        image: "discoenv/vice-file-transfers:qa",
                        imageID: "",
                        started: false,
                    },
                    {
                        name: "vice-proxy",
                        state: viceProxyPodComplete
                            ? {
                                  running: {
                                      startedAt: "2021-02-23T00:07:34Z",
                                  },
                              }
                            : { waiting: { reason: "PodInitializing" } },
                        lastState: {},
                        ready: viceProxyPodComplete,
                        restartCount: 0,
                        image: "discoenv/vice-proxy:qa",
                        imageID: "",
                        started: false,
                    },
                ],
                initContainerStatuses: [
                    {
                        name: "input-files-init",
                        state:
                            uploadStatus === POD_STATUS.WAITING_INIT
                                ? {
                                      waiting: {
                                          reason: "PodInitializing",
                                      },
                                  }
                                : uploadStatus === POD_STATUS.WAITING_ERROR
                                ? {
                                      waiting: {
                                          reason: "CrashLoopBackOff",
                                          message:
                                              "back-off 10s restarting failed container=analysis pod=815b346d-fb00-48bb-96a7-c6d78416c9bb-bcf955fdf-87lks_vice-apps(8f565efd-6b78-43b1-8705-9f53745f1bf0)",
                                      },
                                  }
                                : uploadStatus === POD_STATUS.TERMINATED
                                ? {
                                      terminated: {
                                          exitCode: 127,
                                          reason: "Error",
                                          startedAt: "2021-03-01T22:48:41Z",
                                          finishedAt: "2021-03-01T22:48:41Z",
                                          containerID:
                                              "docker://b6b06372c472fba06ad593d2a90237b1a5ba33f5a434f0508a5468e249e24296",
                                      },
                                  }
                                : uploadStatus === POD_STATUS.RUNNING
                                ? {
                                      running: {
                                          startedAt: "2021-02-22T17:02:01Z",
                                      },
                                  }
                                : {
                                      terminated: {
                                          exitCode: 0,
                                          reason: "Completed",
                                          startedAt: "2021-02-22T16:40:08Z",
                                          finishedAt: "2021-02-22T16:40:17Z",
                                          containerID:
                                              "docker://0e4894febe2a431036b8b220c1dfef80b46510eeb6596f121e6451b3c59abe29",
                                      },
                                  },

                        lastState: {},
                        ready: uploadStatus === POD_STATUS.DONE,
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
        configMaps: configMapsComplete && [
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
        services: serviceComplete && [
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
        ingresses: ingressComplete && [
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
