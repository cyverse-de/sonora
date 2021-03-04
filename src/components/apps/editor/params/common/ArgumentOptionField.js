/**
 * A form component for editing the App parameter `name` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

export default function ArgumentOptionField(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
            name={`${fieldName}.name`}
            label={t("argumentOption")}
            helperText={t("app_editor_help:ArgumentOption")}
            component={FormTextField}
        />
    );
}
