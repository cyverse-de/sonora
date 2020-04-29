import React from "react";

import { Select, MenuItem } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import useStyles from "./styles";
import * as constants from "./constants";
import { id } from "./functions";
import ids from "./ids";

const FieldSelect = ({ id, kind, fields, value, handleChange }) => {
    const classes = useStyles();

    return (
        <Select
            labelId={`${kind}-field-select-label`}
            id={id}
            value={value}
            onChange={handleChange}
            classes={{ root: classes.selectRoot }}
        >
            {Object.keys(fields).map((key) => (
                <MenuItem key={key} value={fields[key]}>
                    {msg(key)}
                </MenuItem>
            ))}
        </Select>
    );
};

const defaultFields = {
    name: constants.NAME,
    namespace: constants.NAMESPACE,
};

export const DeploymentFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        image: constants.IMAGE,
        port: constants.PORT,
        uid: constants.UID,
        gid: constants.GID,
        command: constants.COMMAND,
    };

    const idValue = id(ids.DEPLOYMENT_FIELD_SELECT);
    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const ServiceFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        portName: constants.PORT_NAME,
        nodePort: constants.NODE_PORT,
        targetPort: constants.TARGET_PORT,
        targetPortName: constants.TARGET_PORT_NAME,
        port: constants.PORT,
        protocol: constants.PROTOCOL,
    };

    const idValue = id(ids.SERVICE_FIELD_SELECT);

    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const ConfigMapFieldSelect = ({ value, handleChange }) => {
    const fields = defaultFields;

    const idValue = id(ids.CONFIGMAP_FIELD_SELECT);

    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const IngressFieldSelect = ({ value, handleChange }) => {
    const fields = defaultFields;
    const idValue = id(ids.INGRESS_FIELD_SELECT);

    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const AnalysisFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        analysisName: constants.ANALYSIS_NAME,
        appName: constants.APP_NAME,
        appID: constants.APP_ID,
        externalID: constants.EXTERNAL_ID,
        userID: constants.USER_ID,
        username: constants.USERNAME,
        dateCreated: constants.CREATION_TIMESTAMP,
    };
    const idValue = id(ids.ANALYSIS_FIELD_SELECT);

    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const PodFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        phase: constants.PHASE,
        message: constants.MESSAGE,
        reason: constants.REASON,
        containerStatusName: constants.CONTAINER_STATUS_NAME,
        containerStatusReady: constants.CONTAINER_STATUS_READY,
        containerStatusRestartCount: constants.CONTAINER_STATUS_RESTART_COUNT,
        containerStatusImage: constants.CONTAINER_STATUS_IMAGE,
        containerStatusImageID: constants.CONTAINER_STATUS_IMAGE_ID,
        containerStatusContainerID: constants.CONTAINER_STATUS_CONTAINER_ID,
        containerStatusStarted: constants.CONTAINER_STATUS_STARTED,
    };
    const idValue = id(ids.POD_FIELD_SELECT);

    return (
        <FieldSelect
            id={idValue}
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};
