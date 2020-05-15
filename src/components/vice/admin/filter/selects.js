import React from "react";

import { Select, InputLabel, MenuItem } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import useStyles from "./styles";

export const FieldSelect = ({
    id,
    kind,
    labelI18nKey = "filterField",
    fields,
    value,
    handleChange,
}) => {
    const classes = useStyles();
    const inputLabelID = `${kind}-field-select-label`;
    return (
        <>
            <InputLabel id={inputLabelID}>{msg(labelI18nKey)}</InputLabel>
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
        </>
    );
};

const defaultFields = {
    name: "$.analyses.name",
    namespace: "$.analyses.namespace",
};

export const deploymentFields = {
    ...defaultFields,
    image: "$.deployments.image",
    port: "$.deployments.port",
    uid: "$.deployments.uid",
    gid: "$.deployments.gid",
};

export const serviceFields = {
    ...defaultFields,
    portName: "$.services.portName",
    nodePort: "$.services.nodePort",
    targetPort: "$.services.targetPort",
    targetPortName: "$.services.targetPortName",
    port: "$.services.port",
    protocol: "$.services.protocol",
};

export const configMapFields = defaultFields;

export const ingressFields = defaultFields;

export const analysisFields = {
    ...defaultFields,
    analysisName: "$.analyses.analysisName",
    appName: "$.analyses.appName",
    appID: "$.analyses.appID",
    externalID: "$.analyses.externalID",
    userID: "$.analyses.userID",
    username: "$.analyses.username",
    dateCreated: "$.analyses.creationTimestamp",
};

export const podFields = {
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
