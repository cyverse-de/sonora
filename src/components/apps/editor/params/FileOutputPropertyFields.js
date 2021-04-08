/**
 * A form component for editing App `FileOutput` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import FileInfoTypesSelector from "./FileInfoTypesSelector";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import ImplicitField from "./common/ImplicitField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

import { Grid, MenuItem } from "@material-ui/core";

export const DataSources = {
    FILE: "file",
    STDOUT: "stdout",
    STDERR: "stderr",
};

export default function FileOutputPropertyFields(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation([
        "app_editor",
        "app_editor_help",
        "app_param_types",
    ]);

    const fileParamsFieldName = `${fieldName}.file_parameters`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField baseId={baseId} fieldName={fieldName} />
            <DefaultValueField
                baseId={baseId}
                fieldName={fieldName}
                label={t("fileOutputDefaultLabel")}
                component={FormTextField}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />
            <RequiredField baseId={baseId} fieldName={fieldName} />
            <VisibleField baseId={baseId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseId} fieldName={fieldName} />

            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.DATA_SOURCE)}
                name={`${fileParamsFieldName}.data_source`}
                label={t("dataSourceLabel")}
                component={FormTextField}
                select
                variant="outlined"
                margin="normal"
                size="small"
            >
                <MenuItem value={DataSources.FILE}>
                    {t("app_param_types:DataSrcFile")}
                </MenuItem>
                <MenuItem value={DataSources.STDOUT}>
                    {t("app_param_types:DataSrcStdout")}
                </MenuItem>
                <MenuItem value={DataSources.STDERR}>
                    {t("app_param_types:DataSrcStderr")}
                </MenuItem>
            </FastField>

            <FileInfoTypesSelector
                baseId={baseId}
                fieldName={fileParamsFieldName}
                label={t("fileInfoTypeLabel")}
            />

            <ImplicitField
                baseId={baseId}
                fieldName={fileParamsFieldName}
                helperText={t("app_editor_help:IsImplicitOutput")}
            />
        </Grid>
    );
}
