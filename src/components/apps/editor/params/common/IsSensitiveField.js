/**
 * A form component for editing the App parameter `is_sensitive` property.
 *
 * Marking a parameter sensitive causes its value to be delivered to the
 * analysis via a Kubernetes Secret instead of a plaintext environment
 * variable, and to never be stored or logged.
 * Sensitive parameters are only supported by interactive (VICE) apps.
 *
 * @author mian
 */
import React from "react";

import { Field, getIn } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormCheckbox from "components/forms/FormCheckbox";
import ToolTypes from "components/models/ToolTypes";

export default function IsSensitiveField(props) {
    const { baseId, fieldName, ...custom } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <Field name={`${fieldName}.is_sensitive`}>
            {({ field, form }) => {
                const toolType = getIn(form.values, "tools.0.type");
                const unsupported =
                    field.value &&
                    toolType &&
                    toolType !== ToolTypes.INTERACTIVE;

                return (
                    <FormCheckbox
                        id={buildID(baseId, ids.PARAM_FIELDS.IS_SENSITIVE)}
                        field={field}
                        form={form}
                        label={t("isSensitive")}
                        helperText={
                            unsupported
                                ? t("isSensitiveUnsupportedTool")
                                : t("app_editor_help:IsSensitive")
                        }
                        {...custom}
                    />
                );
            }}
        </Field>
    );
}
