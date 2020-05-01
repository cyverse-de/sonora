import React from "react";

import { Select, MenuItem } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import useStyles from "./styles";
import * as efcs from "./efcs";
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
    name: efcs.analyses.name,
    namespace: efcs.analyses.namespace,
};

export const DeploymentFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        image: efcs.deployments.image,
        port: efcs.deployments.port,
        uid: efcs.deployments.uid,
        gid: efcs.deployments.gid,
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
        portName: efcs.services.portName,
        nodePort: efcs.services.nodePort,
        targetPort: efcs.services.targetPort,
        targetPortName: efcs.services.targetPortName,
        port: efcs.services.port,
        protocol: efcs.services.protocol,
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
        analysisName: efcs.analyses.analysisName,
        appName: efcs.analyses.appName,
        appID: efcs.analyses.appID,
        externalID: efcs.analyses.externalID,
        userID: efcs.analyses.userID,
        username: efcs.analyses.username,
        dateCreated: efcs.analyses.creationTimestamp,
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
        phase: efcs.pods.phase,
        message: efcs.pods.message,
        reason: efcs.pods.reason,
        containerStatusName: efcs.pods.containerStatusName,
        containerStatusReady: efcs.pods.containerStatusReady,
        containerStatusRestartCount: efcs.pods.containerStatusRestartCount,
        containerStatusImage: efcs.pods.containerStatusImage,
        containerStatusImageID: efcs.pods.containerStatusImageID,
        containerStatusContainerID: efcs.pods.containerStatusContainerID,
        containerStatusStarted: efcs.pods.containerStatusStarted,
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
