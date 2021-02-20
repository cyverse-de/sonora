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

import { Button, Container, Grid } from "@material-ui/core";

function CheckboxPropertyFormFields(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation("app_editor");

    return (
        <Grid container>
            <Grid item xs={12}>
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.LABEL)}
                    name={`${fieldName}.label`}
                    label={t("parameterLabel")}
                    component={FormTextField}
                />
            </Grid>
            <Grid
                item
                xs={12}
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.CHECKED_OPTION)}
                        name={`${fieldName}.name.checked.option`}
                        label={t("checkboxArgOptionCheckedLabel")}
                        margin="normal"
                        required
                        component={FormTextField}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.CHECKED_VALUE)}
                        name={`${fieldName}.name.checked.value`}
                        label={t("checkboxArgValueCheckedLabel")}
                        margin="normal"
                        component={FormTextField}
                    />
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.UNCHECKED_OPTION)}
                        name={`${fieldName}.name.unchecked.option`}
                        label={t("checkboxArgOptionUncheckedLabel")}
                        required
                        margin="normal"
                        component={FormTextField}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.UNCHECKED_VALUE)}
                        name={`${fieldName}.name.unchecked.value`}
                        label={t("checkboxArgValueUncheckedLabel")}
                        margin="normal"
                        component={FormTextField}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                    name={`${fieldName}.defaultValue`}
                    label={t("checkboxDefaultLabel")}
                    component={FormCheckbox}
                />
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.DESCRIPTION)}
                    name={`${fieldName}.description`}
                    label={t("helpText")}
                    helperText={t("app_editor_help:HelpText")}
                    component={FormTextField}
                />
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
                    name={`${fieldName}.isVisible`}
                    label={t("isVisible")}
                    component={FormCheckbox}
                />
            </Grid>
        </Grid>
    );
}

function PropertyFormFields(props) {
    const { baseId, fieldName, param } = props;

    const { t } = useTranslation([
        "app_editor",
        "app_editor_help",
        "app_param_types",
    ]);

    let showOmitIfBlank = true;

    let DefaultValueFormComponent = FormTextField;

    let nameLabelKey = "argumentOption";
    let nameHelpTextKey = "app_editor_help:ArgumentOption";
    let defaultValueHelpTextKey = "app_editor_help:DefaultValue";

    switch (param?.type) {
        case AppParamTypes.INFO:
            return (
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.LABEL)}
                    name={`${fieldName}.label`}
                    label={t(`app_param_types:${param.type}`)}
                    component={FormMultilineTextField}
                />
            );

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
                <CheckboxPropertyFormFields
                    baseId={baseId}
                    fieldName={fieldName}
                />
            );

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
                component={FormTextField}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.name`}
                label={t(nameLabelKey)}
                helperText={t(nameHelpTextKey)}
                component={FormTextField}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                name={`${fieldName}.defaultValue`}
                label={t("defaultValue")}
                helperText={t(defaultValueHelpTextKey)}
                component={DefaultValueFormComponent}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.DESCRIPTION)}
                name={`${fieldName}.description`}
                label={t("helpText")}
                helperText={t("app_editor_help:HelpText")}
                component={FormTextField}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.REQUIRED)}
                name={`${fieldName}.required`}
                label={t("isRequired")}
                component={FormCheckbox}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
                name={`${fieldName}.isVisible`}
                label={t("isVisible")}
                component={FormCheckbox}
            />
            {showOmitIfBlank && (
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.OMIT_IF_BLANK)}
                    name={`${fieldName}.omit_if_blank`}
                    label={t("excludeWhenEmpty")}
                    helperText={t("app_editor_help:ExcludeArgument")}
                    component={FormCheckbox}
                />
            )}
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
