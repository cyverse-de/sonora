import React from "react";
import { useTranslation } from "i18n";

import { Select, InputLabel, MenuItem } from "@mui/material";

import useStyles from "./styles";

export const FieldSelect = ({
    id,
    kind,
    labelI18nKey = "filterField",
    fields,
    value,
    handleChange,
}) => {
    const { classes } = useStyles();
    const { t } = useTranslation("vice-admin");
    const inputLabelID = `${kind}-field-select-label`;
    return (
        <>
            <InputLabel id={inputLabelID}>{t(labelI18nKey)}</InputLabel>
            <Select
                variant="standard"
                labelId={inputLabelID}
                id={id}
                value={value}
                onChange={handleChange}
                classes={{ root: classes.selectRoot }}
            >
                {Object.keys(fields).map((key) => (
                    <MenuItem key={key} value={fields[key]}>
                        {t(key)}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};

export const deploymentFields = {
    image: "$.deployments.image",
    port: "$.deployments.port",
    uid: "$.deployments.uid",
    gid: "$.deployments.gid",
};

export const serviceFields = {
    portName: "$.services.portName",
    nodePort: "$.services.nodePort",
    targetPort: "$.services.targetPort",
    targetPortName: "$.services.targetPortName",
    port: "$.services.port",
    protocol: "$.services.protocol",
};

export const commonFields = {
    name: "$.analyses.name",
    namespace: "$.analyses.namespace",
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
