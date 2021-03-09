/**
 * A form component for editing App `Text` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray } from "formik";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import ValidationRulesEditor from "./validators/ValidationRulesEditor";

import { getTextFieldInputProps } from "components/apps/launch/params/Text";
import { ValidatorTypes } from "components/models/AppParamTypes";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

import { Grid } from "@material-ui/core";

export default function TextPropertyFields(props) {
    const { baseId, fieldName, param } = props;

    const validatorsFieldName = `${fieldName}.validators`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField baseId={baseId} fieldName={fieldName} />
            <DefaultValueField
                baseId={baseId}
                fieldName={fieldName}
                component={FormTextField}
                inputProps={getTextFieldInputProps(param)}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />
            <RequiredField baseId={baseId} fieldName={fieldName} />
            <VisibleField baseId={baseId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseId} fieldName={fieldName} />

            <FieldArray
                name={validatorsFieldName}
                render={(arrayHelpers) => {
                    const onAdd = (type) => {
                        arrayHelpers.unshift({
                            type,
                            params: [""],
                        });
                    };

                    const onConfirmDelete = (index) => {
                        arrayHelpers.remove(index);
                    };

                    return (
                        <ValidationRulesEditor
                            baseId={buildID(baseId, "validators")}
                            fieldName={validatorsFieldName}
                            validators={param.validators}
                            ruleOptions={[
                                ValidatorTypes.REGEX,
                                ValidatorTypes.CHARACTER_LIMIT,
                            ]}
                            onAdd={onAdd}
                            onConfirmDelete={onConfirmDelete}
                        />
                    );
                }}
            />
        </Grid>
    );
}
