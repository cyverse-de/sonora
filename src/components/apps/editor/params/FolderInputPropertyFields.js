/**
 * A form component for editing App `FolderInput` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import FolderInput from "components/apps/launch/params/FolderInput";

import FileInfoTypes from "components/models/FileInfoTypes";

import {
    build as buildID,
    FormCheckbox,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Grid, MenuItem } from "@material-ui/core";

export default function FolderInputPropertyFields(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    const fileParamsFieldName = `${fieldName}.file_parameters`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField baseId={baseId} fieldName={fieldName} />
            <DefaultValueField
                baseId={baseId}
                fieldName={fieldName}
                component={FolderInput}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />
            <RequiredField baseId={baseId} fieldName={fieldName} />
            <VisibleField baseId={baseId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseId} fieldName={fieldName} />

            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.FILE_INFO_TYPE)}
                name={`${fileParamsFieldName}.format`}
                label={t("folderInfoTypeLabel")}
                component={FormTextField}
                select
                variant="outlined"
                margin="normal"
                size="small"
            >
                {Object.values(FileInfoTypes).map((infoType) => (
                    <MenuItem key={infoType} value={infoType}>
                        {infoType}
                    </MenuItem>
                ))}
            </FastField>

            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.IMPLICIT)}
                name={`${fileParamsFieldName}.is_implicit`}
                label={t("doNotPass")}
                helperText={t("app_editor_help:IsImplicitFolderInput")}
                component={FormCheckbox}
            />
        </Grid>
    );
}
