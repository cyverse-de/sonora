/**
 * A form component for editing App `Text` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import { getTextFieldInputProps } from "components/apps/launch/params/Text";

import { FormTextField } from "@cyverse-de/ui-lib";

import { Grid } from "@material-ui/core";

export default function TextPropertyFields(props) {
    const { baseId, fieldName, param } = props;

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
        </Grid>
    );
}
