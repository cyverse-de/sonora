export const COMMON_COLUMNS = {
    NAME: "name",
    NAMESPACE: "namespace",
    ANALYSIS_NAME: "analysisName",
    APP_NAME: "appName",
    APP_ID: "appID",
    EXTERNAL_ID: "externalID",
    USER_ID: "userID",
    USERNAME: "username",
    CREATION_TIMESTAMP: "creationTimestamp",
    EXPAND: "expand",
};

export const ANALYSIS_COLUMNS = {
    ACTIONS: "actions",
};

export const DEPLOYMENT_COLUMNS = {
    ...COMMON_COLUMNS,
    IMAGE: "image",
    PORT: "port",
    UID: "uid",
    GID: "gid",
    COMMAND: "command",
    EXPAND: "expand",
};

export const SERVICE_COLUMNS = {
    ...COMMON_COLUMNS,
    PORT_NAME: "portName",
    NODE_PORT: "nodePort",
    TARGET_PORT: "targetPort",
    TARGET_PORT_NAME: "targetPortName",
    PROTOCOL: "protocol",
};

export const POD_COLUMNS = {
    ...COMMON_COLUMNS,
    PHASE: "phase",
    MESSAGE: "message",
    REASON: "reason",
    CONTAINER_STATUS_NAME: "containerStatusName",
    CONTAINER_STATUS_READY: "containerStatusReady",
    CONTAINER_STATUS_RESTART_COUNT: "containerStatusRestartCount",
    CONTAINER_STATUS_IMAGE: "containerStatusImage",
    CONTAINER_STATUS_IMAGE_ID: "containerStatusImageID",
    CONTAINER_STATUS_CONTAINER_ID: "containerStatusContainerID",
    CONTAINER_STATUS_STARTED: "containerStatusStarted",
};

// We'll probably end up adding more columns, so this is getting
// it's own set of constants.
export const CONFIG_MAP_COLUMNS = {
    ...COMMON_COLUMNS,
};

// We'll probably end up adding more columns, so this is getting
// it's own set of constants.
export const INGRESS_COLUMNS = {
    ...COMMON_COLUMNS,
};
