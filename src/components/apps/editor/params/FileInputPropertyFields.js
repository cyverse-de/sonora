/**
 * A form component for editing App `FileInput` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import FileInfoTypesSelector from "./FileInfoTypesSelector";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import ImplicitField from "./common/ImplicitField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import FileInput from "components/apps/launch/params/FileInput";

import { Grid } from "@material-ui/core";

export default function FileInputPropertyFields(props) {
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
                component={FileInput}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />
            <RequiredField baseId={baseId} fieldName={fieldName} />
            <VisibleField baseId={baseId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseId} fieldName={fieldName} />

            <FileInfoTypesSelector
                baseId={baseId}
                fieldName={fileParamsFieldName}
                label={t("fileInfoTypeLabel")}
            />

            <ImplicitField
                baseId={baseId}
                fieldName={fileParamsFieldName}
                helperText={t("app_editor_help:IsImplicitFileInput")}
            />
        </Grid>
    );
}
