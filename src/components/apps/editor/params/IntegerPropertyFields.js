/**
 * A form component for editing App `Integer` parameter properties.
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

import { ValidatorTypes } from "components/models/AppParamTypes";

import buildID from "components/utils/DebugIDUtil";
import FormIntegerField from "components/forms/FormIntegerField";

import { Grid } from "@mui/material";

export default function IntegerPropertyFields(props) {
    const { baseId, cosmeticOnly, fieldName, param } = props;

    const validatorsFieldName = `${fieldName}.validators`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <DefaultValueField
                baseId={baseId}
                fieldName={fieldName}
                component={FormIntegerField}
                disabled={cosmeticOnly}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />

            <RequiredField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <VisibleField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <ExcludeArgumentField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />

            <FieldArray
                name={validatorsFieldName}
                render={(arrayHelpers) => {
                    const onAdd = (type) => {
                        arrayHelpers.unshift({
                            type,
                            params:
                                type === ValidatorTypes.INT_RANGE
                                    ? ["", ""]
                                    : [""],
                        });
                    };

                    const onConfirmDelete = (index) => {
                        arrayHelpers.remove(index);
                    };

                    return (
                        <ValidationRulesEditor
                            baseId={buildID(baseId, "validators")}
                            cosmeticOnly={cosmeticOnly}
                            fieldName={validatorsFieldName}
                            validators={param.validators}
                            ruleOptions={[
                                ValidatorTypes.INT_ABOVE,
                                ValidatorTypes.INT_BELOW,
                                ValidatorTypes.INT_RANGE,
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
