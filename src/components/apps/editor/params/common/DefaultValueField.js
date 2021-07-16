/**
 * A form component for editing the App parameter `defaultValue` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

export default function DefaultValueField(props) {
    const { baseId, fieldName, component, ...custom } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
            name={`${fieldName}.defaultValue`}
            label={t("defaultValue")}
            helperText={t("app_editor_help:DefaultValue")}
            component={component || FormTextField}
            {...custom}
        />
    );
}
