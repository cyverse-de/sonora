/**
 * A form component for editing App `EnvironmentVariable` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import DescriptionField from "./common/DescriptionField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import { Grid } from "@mui/material";

export default function EnvironmentVariablePropertyFields(props) {
    const { baseId, cosmeticOnly, fieldName } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />

            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.name`}
                label={t("envVarNameLabel")}
                helperText={t("app_editor_help:EnvironmentVariableDefaultName")}
                component={FormTextField}
                disabled={cosmeticOnly}
            />
            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                name={`${fieldName}.defaultValue`}
                label={t("defaultValue")}
                helperText={t(
                    "app_editor_help:EnvironmentVariableDefaultValue"
                )}
                component={FormTextField}
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
        </Grid>
    );
}
