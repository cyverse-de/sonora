import React from "react";

import { Select, InputLabel, MenuItem, FormControl } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import useStyles from "./styles";
import { id } from "./functions";
import ids from "./ids";

const FieldSelect = ({
    id,
    kind,
    label = "Filter Field",
    fields,
    value,
    handleChange,
}) => {
    const classes = useStyles();
    const inputLabelID = `${kind}-field-select-label`;
    return (
        <FormControl>
            <InputLabel id={inputLabelID}>{label}</InputLabel>
            <Select
                labelId={inputLabelID}
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
        </FormControl>
    );
};

const defaultFields = {
    name: "$.analyses.name",
    namespace: "$.analyses.namespace",
};

export const DeploymentFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        image: "$.deployments.image",
        port: "$.deployments.port",
        uid: "$.deployments.uid",
        gid: "$.deployments.gid",
    };

    const idValue = id(ids.DEPLOYMENT_FIELD_SELECT);
    return (
        <FieldSelect
            id={idValue}
            kind="deployment"
            fields={fields}
            value={value}
            handleChange={handleChange}
        />
    );
};

export const ServiceFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        portName: "$.services.portName",
        nodePort: "$.services.nodePort",
        targetPort: "$.services.targetPort",
        targetPortName: "$.services.targetPortName",
        port: "$.services.port",
        protocol: "$.services.protocol",
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
        analysisName: "$.analyses.analysisName",
        appName: "$.analyses.appName",
        appID: "$.analyses.appID",
        externalID: "$.analyses.externalID",
        userID: "$.analyses.userID",
        username: "$.analyses.username",
        dateCreated: "$.analyses.creationTimestamp",
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
        phase: "$.pods.phase",
        message: "$.pods.message",
        reason: "$.pods.reason",
        containerStatusName: "$.pods.containerStatusName",
        containerStatusReady: "$.pods.containerStatusReady",
        containerStatusRestartCount: "$.pods.containerStatusRestartCount",
        containerStatusImage: "$.pods.containerStatusImage",
        containerStatusImageID: "$.pods.containerStatusImageID",
        containerStatusContainerID: "$.pods.containerStatusContainerID",
        containerStatusStarted: "$.pods.containerStatusStarted",
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
