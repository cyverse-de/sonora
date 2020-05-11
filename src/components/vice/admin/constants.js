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

export const DEPLOYMENT_COLUMNS = {
    ...COMMON_COLUMNS,
    IMAGE: "image",
    PORT: "port",
    UID: "uid",
    GID: "gid",
    COMMAND: "command",
    EXPAND: "expand",
};
