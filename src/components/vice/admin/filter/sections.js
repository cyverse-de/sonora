import React, { useState } from "react";

import { Typography, Button, TextField, FormControl } from "@material-ui/core";

import { getMessage as msg } from "@cyverse-de/ui-lib";

import {
    deploymentFields,
    serviceFields,
    configMapFields,
    ingressFields,
    analysisFields,
    podFields,
    FieldSelect,
} from "./selects";

import useStyles from "./styles";
import { id } from "./functions";
import ids from "./ids";

const FilterSection = ({
    section,
    valueID,
    fieldID,
    fields,
    kind,
    addToFilters,
}) => {
    const classes = useStyles();
    const [field, setField] = useState("");
    const [value, setValue] = useState("");

    const handleFieldChange = (e) => setField(e.target.value);
    const handleValueChange = (e) => setValue(e.target.value);

    const handleAddClick = () => {
        addToFilters(field, value);
        setField("");
        setValue("");
    };

    return (
        <>
            <Typography noWrap variant="h6" component="h6">
                {section}
            </Typography>

            <FormControl>
                <div
                    id={id(`section.${section}`)}
                    className={classes.sectionRoot}
                >
                    <FieldSelect
                        id={fieldID}
                        fields={fields}
                        value={field}
                        kind={kind}
                        handleChange={handleFieldChange}
                    />

                    <TextField
                        id={valueID}
                        label={msg("filterValue")}
                        className={classes.textField}
                        value={value}
                        onChange={handleValueChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddClick();
                            }
                        }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        {msg("add")}
                    </Button>
                </div>
            </FormControl>
        </>
    );
};

export const DeploymentFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.DEPLOYMENT_FIELD_VALUE);
    const fieldID = id(ids.DEPLOYMENT_FIELD_SELECT);

    return (
        <FilterSection
            section={msg("deployments")}
            valueID={valueID}
            fieldID={fieldID}
            fields={deploymentFields}
            kind="deployment"
            addToFilters={addToFilters}
        />
    );
};

export const ServiceFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.SERVICE_FIELD_VALUE);
    const fieldID = id(ids.SERVICE_FIELD_SELECT);

    return (
        <FilterSection
            section={msg("services")}
            valueID={valueID}
            fieldID={fieldID}
            fields={serviceFields}
            kind="service"
            addToFilters={addToFilters}
        />
    );
};

export const ConfigMapFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.CONFIGMAP_FIELD_VALUE);
    const fieldID = id(ids.DEPLOYMENT_FIELD_SELECT);

    return (
        <FilterSection
            section={msg("configMaps")}
            valueID={valueID}
            fieldID={fieldID}
            fields={configMapFields}
            kind="configMap"
            addToFilters={addToFilters}
        />
    );
};

export const IngressFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.INGRESS_FIELD_VALUE);
    const fieldID = id(ids.INGRESS_FIELD_SELECT);

    return (
        <FilterSection
            section={msg("ingresses")}
            valueID={valueID}
            fieldID={fieldID}
            fields={ingressFields}
            kind="ingress"
            addToFilters={addToFilters}
        />
    );
};

export const AnalysisFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.ANALYSIS_FIELD_VALUE);
    const fieldID = id(ids.ANALYSIS_FIELD_SELECT);

    return (
        <FilterSection
            section={msg("analyses")}
            valueID={valueID}
            fieldID={fieldID}
            fields={analysisFields}
            kind="analysis"
            addToFilters={addToFilters}
        />
    );
};

export const PodFilterSection = ({ addToFilters }) => {
    const valueID = id(ids.POD_FIELD_VALUE);
    const fieldID = id(ids.POD_FIELD_VALUE);

    return (
        <FilterSection
            section={msg("pods")}
            valueID={valueID}
            fieldID={fieldID}
            fields={podFields}
            kind="pod"
            addToFilters={addToFilters}
        />
    );
};
