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
    TextField,
    Typography,
    Button,
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
    sectionRoot: {
        display: "flex",
        marginBottom: theme.spacing(5),
    },
    selectRoot: {
        width: 250,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "50ch",
    },
}));

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

const FilterSection = ({ section, children, handleAddClick }) => {
    const classes = useStyles();

    return (
        <>
            <Typography noWrap variant="h6" component="h6">
                {section}
            </Typography>
            <div id={id(`section.${section}`)} className={classes.sectionRoot}>
                {children}
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddClick}
                >
                    {msg("add")}
                </Button>
            </div>
        </>
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

const DeploymentFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [depField, setDepField] = useState("");
    const [depValue, setDepValue] = useState("");

    return (
        <FilterSection
            section={msg("deployments")}
            handleAddClick={() => {
                addToFilters(depField, depValue);
                setDepField("");
                setDepValue("");
            }}
        >
            <DeploymentFieldSelect
                value={depField}
                handleChange={(e) => setDepField(e.target.value)}
            />
            <TextField
                id={id(ids.DEPLOYMENT_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={depValue}
                onChange={(e) => setDepValue(e.target.value)}
            />
        </FilterSection>
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

const ServiceFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [serviceField, setServiceField] = useState("");
    const [serviceValue, setServiceValue] = useState("");

    return (
        <FilterSection
            section={msg("services")}
            handleAddClick={() => {
                addToFilters(serviceField, serviceValue);
                setServiceField("");
                setServiceValue("");
            }}
        >
            <ServiceFieldSelect
                value={serviceField}
                handleChange={(e) => setServiceField(e.target.value)}
            />
            <TextField
                id={id(ids.SERVICE_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
            />
        </FilterSection>
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

const ConfigMapFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [configMapField, setConfigMapField] = useState("");
    const [configMapValue, setConfigMapValue] = useState("");

    return (
        <FilterSection
            section={msg("configMaps")}
            handleAddClick={() => {
                addToFilters(configMapField, configMapValue);
                setConfigMapField("");
                setConfigMapValue("");
            }}
        >
            <ConfigMapFieldSelect
                value={configMapField}
                handleChange={(e) => setConfigMapField(e.target.value)}
            />
            <TextField
                id={id(ids.CONFIGMAP_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={configMapValue}
                onChange={(e) => setConfigMapValue(e.target.value)}
            />
        </FilterSection>
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

const IngressFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [ingressField, setIngressField] = useState("");
    const [ingressValue, setIngressValue] = useState("");

    return (
        <FilterSection
            section={msg("ingresses")}
            handleAddClick={() => {
                addToFilters(ingressField, ingressValue);
                setIngressField("");
                setIngressValue("");
            }}
        >
            <IngressFieldSelect
                value={ingressField}
                handleChange={(e) => setIngressField(e.target.value)}
            />
            <TextField
                id={id(ids.INGRESS_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={ingressValue}
                onChange={(e) => setIngressValue(e.target.value)}
            />
        </FilterSection>
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

const AnalysisFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [analysisField, setAnalysisField] = useState("");
    const [analysisValue, setAnalysisValue] = useState("");

    return (
        <FilterSection
            section={msg("analyses")}
            handleAddClick={() => {
                addToFilters(analysisField, analysisValue);
                setAnalysisField("");
                setAnalysisValue("");
            }}
        >
            <AnalysisFieldSelect
                value={analysisField}
                handleChange={(e) => setAnalysisField(e.target.value)}
            />
            <TextField
                id={id(ids.ANALYSIS_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={analysisValue}
                onChange={(e) => setAnalysisValue(e.target.value)}
            />
        </FilterSection>
    );
};

const PodFieldSelect = ({ value, handleChange }) => {
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

const PodFilterSection = ({ addToFilters }) => {
    const classes = useStyles();

    const [podField, setPodField] = useState("");
    const [podValue, setPodValue] = useState("");

    return (
        <FilterSection
            section={msg("pods")}
            handleAddClick={() => {
                addToFilters(podField, podValue);
                setPodField("");
                setPodValue("");
            }}
        >
            <PodFieldSelect
                value={podField}
                handleChange={(e) => setPodField(e.target.value)}
            />
            <TextField
                id={id(ids.POD_FIELD_VALUE)}
                label={msg("filterValue")}
                className={classes.textField}
                value={podValue}
                onChange={(e) => setPodValue(e.target.value)}
            />
        </FilterSection>
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

const AnalysesFilter = ({ filters, addToFilters, deleteFromFilters }) => {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Card id={id(ids.ROOT)} className={classes.root}>
            <CardContent>
                <div className={classes.chips}>
                    {filters.map((filter, index) => (
                        <FilterChip
                            key={`${filter.key}-${index}`}
                            label={`${filter.key}=${filter.value}`}
                            handleDelete={(_ev, _el) =>
                                deleteFromFilters(filter)
                            }
                        />
                    ))}
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
                    <AnalysisFilterSection addToFilters={addToFilters} />
                    <DeploymentFilterSection addToFilters={addToFilters} />
                    <ServiceFilterSection addToFilters={addToFilters} />
                    <PodFilterSection addToFilters={addToFilters} />
                    <ConfigMapFilterSection addToFilters={addToFilters} />
                    <IngressFilterSection addToFilters={addToFilters} />
                </div>
            </Collapse>
        </Card>
    );
};

export default withI18N(AnalysesFilter, messages);
