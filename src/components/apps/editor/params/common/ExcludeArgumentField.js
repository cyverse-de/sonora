/**
 * A form component for editing the App parameter `omit_if_blank` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormCheckbox from "components/forms/FormCheckbox";

export default function ExcludeArgumentField(props) {
    const { baseId, fieldName, ...custom } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.OMIT_IF_BLANK)}
            name={`${fieldName}.omit_if_blank`}
            label={t("excludeWhenEmpty")}
            helperText={t("app_editor_help:ExcludeArgument")}
            component={FormCheckbox}
            {...custom}
        />
    );
}
