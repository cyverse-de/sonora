/**
 * A form component for editing App parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";

import AppParamTypes from "components/models/AppParamTypes";
import DEDialog from "components/utils/DEDialog";

import {
    build as buildID,
    FormCheckbox,
    FormIntegerField,
    FormNumberField,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Button, Container } from "@material-ui/core";

function PropertyFormFields(props) {
    const { baseId, fieldName, param } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    const isInfoParam = param?.type === AppParamTypes.INFO;
    let showOmitIfBlank = true;

    let LabelFormComponent = FormTextField;
    let DefaultValueFormComponent = FormTextField;

    let nameLabelKey = "argumentOption";
    let nameHelpTextKey = "app_editor_help:ArgumentOption";
    let defaultValueHelpTextKey = "app_editor_help:DefaultValue";

    switch (param?.type) {
        case AppParamTypes.INFO:
            LabelFormComponent = FormMultilineTextField;
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

        case AppParamTypes.ENV_VAR:
            showOmitIfBlank = false;
            nameLabelKey = "envVarNameLabel";
            nameHelpTextKey = "app_editor_help:EnvironmentVariableDefaultName";
            defaultValueHelpTextKey =
                "app_editor_help:EnvironmentVariableDefaultValue";
            break;

        default:
            break;
    }

    return (
        <Container style={{ display: "flex", flexDirection: "column" }}>
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.LABEL)}
                name={`${fieldName}.label`}
                label={t("parameterLabel")}
                component={LabelFormComponent}
            />
            {!isInfoParam && [
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.NAME)}
                    key={`${fieldName}.name`}
                    name={`${fieldName}.name`}
                    label={t(nameLabelKey)}
                    helperText={t(nameHelpTextKey)}
                    component={FormTextField}
                />,
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                    key={`${fieldName}.defaultValue`}
                    name={`${fieldName}.defaultValue`}
                    label={t("defaultValue")}
                    helperText={t(defaultValueHelpTextKey)}
                    component={DefaultValueFormComponent}
                />,
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.DESCRIPTION)}
                    key={`${fieldName}.description`}
                    name={`${fieldName}.description`}
                    label={t("helpText")}
                    helperText={t("app_editor_help:HelpText")}
                    component={FormTextField}
                />,
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.REQUIRED)}
                    key={`${fieldName}.required`}
                    name={`${fieldName}.required`}
                    label={t("isRequired")}
                    component={FormCheckbox}
                />,
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
                    key={`${fieldName}.isVisible`}
                    name={`${fieldName}.isVisible`}
                    label={t("isVisible")}
                    component={FormCheckbox}
                />,
                showOmitIfBlank && (
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
                        key={`${fieldName}.omit_if_blank`}
                        name={`${fieldName}.omit_if_blank`}
                        label={t("excludeWhenEmpty")}
                        helperText={t("app_editor_help:ExcludeArgument")}
                        component={FormCheckbox}
                    />
                ),
            ]}
        </Container>
    );
}

function ParamPropertyForm(props) {
    const { baseId, fieldName, open, onClose, param } = props;

    const { t } = useTranslation(["app_editor", "common"]);

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            title={t("editParameter")}
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
