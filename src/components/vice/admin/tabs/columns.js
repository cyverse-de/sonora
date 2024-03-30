import { defineColumn, ExpanderColumn } from "components/vice/admin/table";

import {
    DEPLOYMENT_COLUMNS,
    COMMON_COLUMNS,
    SERVICE_COLUMNS,
    POD_COLUMNS,
} from "components/vice/admin/constants";

// The column definitions for the table.
export const commonColumns = [
    ExpanderColumn,
    defineColumn("Username", COMMON_COLUMNS.USERNAME, "username"),
    defineColumn(
        "Date Created",
        COMMON_COLUMNS.CREATION_TIMESTAMP,
        "creationTimestamp"
    ),
    defineColumn("Analysis Name", COMMON_COLUMNS.ANALYSIS_NAME, "analysisName"),
    defineColumn("App Name", COMMON_COLUMNS.APP_NAME, "appName"),
    defineColumn("Namespace", COMMON_COLUMNS.NAMESPACE, "namespace"),
    defineColumn("External ID", COMMON_COLUMNS.EXTERNAL_ID, "externalID"),
    defineColumn("App ID", COMMON_COLUMNS.APP_ID, "appID"),
    defineColumn("User ID", COMMON_COLUMNS.USER_ID, "userID"),
];

const columns = {
    analyses: commonColumns,

    deployments: [
        ...commonColumns,
        defineColumn("Image", DEPLOYMENT_COLUMNS.IMAGE, "image"),
        defineColumn("Port", DEPLOYMENT_COLUMNS.PORT, "port"),
        defineColumn("UID", DEPLOYMENT_COLUMNS.UID, "uid"),
        defineColumn("GID", DEPLOYMENT_COLUMNS.GID, "gid"),
    ],

    services: [
        ...commonColumns,
        defineColumn("Port Name", SERVICE_COLUMNS.PORT_NAME, "portName"),
        defineColumn("Node Port", SERVICE_COLUMNS.NODE_PORT, "nodePort"),
        defineColumn("Target Port", SERVICE_COLUMNS.TARGET_PORT, "targetPort"),
        defineColumn(
            "Target Port Name",
            SERVICE_COLUMNS.TARGET_PORT_NAME,
            "targetPortName"
        ),
        defineColumn("Protocol", SERVICE_COLUMNS.PROTOCOL, "protocol"),
    ],

    pods: [
        ...commonColumns,
        defineColumn("Phase", POD_COLUMNS.PHASE, "phase"),
        defineColumn("Message", POD_COLUMNS.MESSAGE, "message"),
        defineColumn("Reason", POD_COLUMNS.REASON, "reason"),
        defineColumn(
            "Status - Name",
            POD_COLUMNS.CONTAINER_STATUS_NAME,
            "containerStatusName"
        ),
        defineColumn(
            "Status - Ready",
            POD_COLUMNS.CONTAINER_STATUS_READY,
            "containerStatusReady"
        ),
        defineColumn(
            "Status - Restart Count",
            POD_COLUMNS.CONTAINER_STATUS_RESTART_COUNT,
            "containerStatusRestartCount"
        ),
        defineColumn(
            "Status - Image",
            POD_COLUMNS.CONTAINER_STATUS_IMAGE,
            "containerStatusImage"
        ),
        defineColumn(
            "Status - Image ID",
            POD_COLUMNS.CONTAINER_STATUS_IMAGE_ID,
            "containerStatusImageID"
        ),
        defineColumn(
            "Status - Container ID",
            POD_COLUMNS.CONTAINER_STATUS_CONTAINER_ID,
            "containerStatusContainerID"
        ),
        defineColumn(
            "Status - Started",
            POD_COLUMNS.CONTAINER_STATUS_STARTED,
            "containerStatusStarted"
        ),
    ],

    configMaps: commonColumns,
    ingresses: commonColumns,
};

export default columns;
