/**
 * A form component for editing App parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "./ids";

import ArgumentOptionField from "./params/ArgumentOptionField";
import CheckboxPropertyFields from "./params/CheckboxPropertyFields";
import DefaultValueField from "./params/DefaultValueField";
import DescriptionField from "./params/DescriptionField";
import ExcludeArgumentField from "./params/ExcludeArgumentField";
import EnvironmentVariablePropertyFields from "./params/EnvironmentVariablePropertyFields";
import InfoTextField from "./params/InfoTextField";
import LabelField from "./params/LabelField";
import RequiredField from "./params/RequiredField";
import VisibleField from "./params/VisibleField";

import { getTextFieldInputProps } from "components/apps/launch/params/Text";
import AppParamTypes from "components/models/AppParamTypes";
import DEDialog from "components/utils/DEDialog";

import {
    build as buildID,
    FormIntegerField,
    FormNumberField,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Button, Grid } from "@material-ui/core";

function PropertyFormFields(props) {
    const { baseId, fieldName, param } = props;

    const baseParamId = buildID(baseId, fieldName);

    let DefaultValueFormComponent = FormTextField;
    let inputProps = {};

    switch (param?.type) {
        case AppParamTypes.INFO:
            return <InfoTextField baseId={baseParamId} fieldName={fieldName} />;

        case AppParamTypes.TEXT:
            inputProps = getTextFieldInputProps(param);
            break;

        case AppParamTypes.MULTILINE_TEXT:
            DefaultValueFormComponent = FormMultilineTextField;
            break;

        case AppParamTypes.INTEGER:
            DefaultValueFormComponent = FormIntegerField;
            break;

        case AppParamTypes.DOUBLE:
            DefaultValueFormComponent = FormNumberField;
            break;

        case AppParamTypes.FLAG:
            return (
                <CheckboxPropertyFields
                    baseId={baseParamId}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.ENV_VAR:
            return (
                <EnvironmentVariablePropertyFields
                    baseId={baseParamId}
                    fieldName={fieldName}
                />
            );

        default:
            break;
    }

    return (
        <Grid container direction="column">
            <LabelField baseId={baseParamId} fieldName={fieldName} />
            <ArgumentOptionField baseId={baseParamId} fieldName={fieldName} />
            <DefaultValueField
                baseId={baseParamId}
                fieldName={fieldName}
                component={DefaultValueFormComponent}
                inputProps={inputProps}
            />
            <DescriptionField baseId={baseParamId} fieldName={fieldName} />
            <RequiredField baseId={baseParamId} fieldName={fieldName} />
            <VisibleField baseId={baseParamId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseParamId} fieldName={fieldName} />
        </Grid>
    );
}

function ParamPropertyForm(props) {
    const { baseId, fieldName, open, onClose, param } = props;

    const { t } = useTranslation(["app_editor", "app_param_types", "common"]);

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            title={t("editParameter", {
                type: t(`app_param_types:${param?.type}`),
            })}
            onClose={onClose}
            disableBackdropClick
            disableEscapeKeyDown
            actions={
                <Button
                    id={buildID(baseId, ids.BUTTONS.CLOSE_BTN)}
                    color="primary"
                    variant="contained"
                    onClick={onClose}
                >
                    {t("common:done")}
                </Button>
            }
        >
            {open && (
                <PropertyFormFields
                    baseId={baseId}
                    fieldName={fieldName}
                    param={param}
                />
            )}
        </DEDialog>
    );
}

export default ParamPropertyForm;
