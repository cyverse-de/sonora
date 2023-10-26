import React, { useState } from "react";
import { useTranslation } from "i18n";

import { Typography, Button, TextField, FormControl } from "@mui/material";

import {
    deploymentFields,
    serviceFields,
    commonFields,
    podFields,
    FieldSelect,
} from "./selects";

import useStyles from "./styles";
import { id } from "./functions";
import ids from "./ids";

const FilterSection = ({
    section,
    description,
    valueID,
    fieldID,
    fields,
    kind,
    addToFilters,
}) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");
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
            <Typography noWrap variant="h6" component="h6" gutterBottom>
                {section}
            </Typography>

            <Typography color="textSecondary">{description}</Typography>

            <FormControl variant="standard">
                <div id={id("section", kind)} className={classes.sectionRoot}>
                    <FieldSelect
                        id={fieldID}
                        fields={fields}
                        value={field}
                        kind={kind}
                        handleChange={handleFieldChange}
                    />

                    <TextField
                        variant="standard"
                        id={valueID}
                        label={t("filterValue")}
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
                        id={id("section", kind, "button")}
                    >
                        {t("add")}
                    </Button>
                </div>
            </FormControl>
        </>
    );
};

export const DeploymentFilterSection = ({ addToFilters }) => {
    const { t } = useTranslation("vice-admin");
    const valueID = id(ids.DEPLOYMENT_FIELD_VALUE);
    const fieldID = id(ids.DEPLOYMENT_FIELD_SELECT);

    return (
        <FilterSection
            section={t("deployments")}
            description={t("deploymentsDescription")}
            valueID={valueID}
            fieldID={fieldID}
            fields={deploymentFields}
            kind="deployment"
            addToFilters={addToFilters}
        />
    );
};

export const ServiceFilterSection = ({ addToFilters }) => {
    const { t } = useTranslation("vice-admin");
    const valueID = id(ids.SERVICE_FIELD_VALUE);
    const fieldID = id(ids.SERVICE_FIELD_SELECT);

    return (
        <FilterSection
            section={t("services")}
            description={t("servicesDescription")}
            valueID={valueID}
            fieldID={fieldID}
            fields={serviceFields}
            kind="service"
            addToFilters={addToFilters}
        />
    );
};

export const CommonFilterSection = ({ addToFilters }) => {
    const { t } = useTranslation("vice-admin");
    const valueID = id(ids.COMMON_FIELD_VALUE);
    const fieldID = id(ids.COMMON_FIELD_SELECT);

    return (
        <FilterSection
            section={t("common")}
            description={t("commonDescription")}
            valueID={valueID}
            fieldID={fieldID}
            fields={commonFields}
            kind="common"
            addToFilters={addToFilters}
        />
    );
};

export const PodFilterSection = ({ addToFilters }) => {
    const { t } = useTranslation("vice-admin");
    const valueID = id(ids.POD_FIELD_VALUE);
    const fieldID = id(ids.POD_FIELD_VALUE);

    return (
        <FilterSection
            section={t("pods")}
            description={t("podsDescription")}
            valueID={valueID}
            fieldID={fieldID}
            fields={podFields}
            kind="pod"
            addToFilters={addToFilters}
        />
    );
};
