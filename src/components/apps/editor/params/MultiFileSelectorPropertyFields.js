/**
 * A form component for editing App `MultiFileSelector` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import FileInfoTypesSelector from "./FileInfoTypesSelector";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import ImplicitField from "./common/ImplicitField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";

import { build as buildID, FormCheckbox } from "@cyverse-de/ui-lib";

import { Grid } from "@material-ui/core";

export default function MultiFileSelectorPropertyFields(props) {
    const { baseId, cosmeticOnly, fieldName } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    const fileParamsFieldName = `${fieldName}.file_parameters`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />

            <RequiredField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <ExcludeArgumentField
                baseId={baseId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />

            <FileInfoTypesSelector
                baseId={baseId}
                disabled={cosmeticOnly}
                fieldName={fileParamsFieldName}
                label={t("multiFileInfoTypeLabel")}
            />

            <ImplicitField
                baseId={baseId}
                fieldName={fileParamsFieldName}
                helperText={t("app_editor_help:IsImplicitFileInput")}
                disabled={cosmeticOnly}
            />

            <FastField
                id={buildID(baseId, ids.PARAM_FIELDS.REPEAT_OPTION_FLAG)}
                name={`${fileParamsFieldName}.repeat_option_flag`}
                label={t("repeatOptionFlag")}
                helperText={t("app_editor_help:RepeatOptionFlag")}
                component={FormCheckbox}
                disabled={cosmeticOnly}
            />
        </Grid>
    );
}
