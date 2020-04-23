import React, { useState } from "react";

import classnames from "classnames";

import {
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import {
    build as buildID,
    getMessage as msg,
    withI18N,
} from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";
import * as constants from "./constants";

const id = (name) => buildID(ids.BASE, name);

const useStyles = makeStyles((theme) => ({
    actions: {
        display: "flex",
    },
    chip: {
        margin: theme.spacing(1),
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    collapse: {
        margin: theme.spacing(2),
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    root: {
        marginBottom: theme.spacing(4),
    },
}));

const FieldSelect = ({ id, kind, fields, value, handleChange }) => {
    return (
        <Select
            labelId={`${kind}-field-select-label`}
            id={id}
            value={value}
            onChange={handleChange}
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

const DeploymentFieldSelect = ({ value, handleChange }) => {
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

const ServiceFieldSelect = ({ value, handleChange }) => {
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

const ConfigMapFieldSelect = ({ value, handleChange }) => {
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

const IngressFieldSelect = ({ value, handleChange }) => {
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

const AnalysisFieldSelect = ({ value, handleChange }) => {
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

const PodFieldSelect = ({ value, handleChange }) => {
    const fields = {
        ...defaultFields,
        phase: constants.PHASE,
        message: constants.MESSAGE,
        reason: constants.REASON,
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

const FilterChip = ({ label, handleDelete }) => {
    const [deleted, setDeleted] = useState(false);
    const classes = useStyles();

    const chipDelete = (event, element) => {
        setDeleted(true);
        if (handleDelete) {
            handleDelete(event, element);
        }
    };

    if (!deleted) {
        return (
            <Chip
                className={classes.chip}
                label={label}
                onDelete={chipDelete}
                color="primary"
            />
        );
    }

    return <></>;
};

const FilterSection = ({ section, children }) => {
    return (
        <>
            <Typography noWrap variant="h6" component="h6">
                {section}
            </Typography>
            {children}
        </>
    );
};

const AnalysesFilter = () => {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [depField, setDepField] = useState("");
    const [serviceField, setServiceField] = useState("");
    const [configMapField, setConfigMapField] = useState("");
    const [ingressField, setIngressField] = useState("");
    const [analysisField, setAnalysisField] = useState("");
    const [podField, setPodField] = useState("");

    return (
        <Card id={id(ids.ROOT)} className={classes.root}>
            <CardContent>
                <div className={classes.chips}>
                    <FilterChip label="test0" />
                    <FilterChip label="test1" />
                    <FilterChip label="test2" />
                    <FilterChip label="test3" />
                    <FilterChip label="test4" />
                    <FilterChip label="test5" />
                </div>
            </CardContent>

            <CardActions className={classes.actions} disableSpacing>
                <IconButton
                    className={classnames(classes.expand, {
                        [classes.expandOpen]: isExpanded,
                    })}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label="Show Filter Options"
                >
                    <ExpandMore />
                </IconButton>
            </CardActions>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <div className={classes.collapse}>
                    <FilterSection section={msg("analyses")}>
                        <AnalysisFieldSelect
                            value={analysisField}
                            handleChange={(e) =>
                                setAnalysisField(e.target.value)
                            }
                        />
                    </FilterSection>

                    <FilterSection section={msg("deployments")}>
                        <DeploymentFieldSelect
                            value={depField}
                            handleChange={(e) => setDepField(e.target.value)}
                        />
                    </FilterSection>

                    <FilterSection section={msg("pods")}>
                        <PodFieldSelect
                            value={podField}
                            handleChange={(e) => setPodField(e.target.value)}
                        />
                    </FilterSection>

                    <FilterSection section={msg("services")}>
                        <ServiceFieldSelect
                            value={serviceField}
                            handleChange={(e) =>
                                setServiceField(e.target.value)
                            }
                        />
                    </FilterSection>

                    <FilterSection section={msg("configMaps")}>
                        <ConfigMapFieldSelect
                            value={configMapField}
                            handleChange={(e) =>
                                setConfigMapField(e.target.value)
                            }
                        />
                    </FilterSection>

                    <FilterSection section={msg("ingresses")}>
                        <IngressFieldSelect
                            value={ingressField}
                            handleChange={(e) =>
                                setIngressField(e.target.value)
                            }
                        />
                    </FilterSection>
                </div>
            </Collapse>
        </Card>
    );
};

export default withI18N(AnalysesFilter, messages);
