import React, { useState } from "react";

import { Typography, Button, TextField } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import {
    AnalysisFieldSelect,
    DeploymentFieldSelect,
    IngressFieldSelect,
    ConfigMapFieldSelect,
    ServiceFieldSelect,
    PodFieldSelect,
} from "./selects";

import useStyles from "./styles";
import { id } from "./functions";
import ids from "./ids";

export const FilterSection = ({ section, children, handleAddClick }) => {
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

export const DeploymentFilterSection = ({ addToFilters }) => {
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

export const ServiceFilterSection = ({ addToFilters }) => {
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

export const ConfigMapFilterSection = ({ addToFilters }) => {
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

export const IngressFilterSection = ({ addToFilters }) => {
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

export const AnalysisFilterSection = ({ addToFilters }) => {
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

export const PodFilterSection = ({ addToFilters }) => {
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
