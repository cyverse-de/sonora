/**
 * A form component for editing App `Info` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import AppParamTypes from "components/models/AppParamTypes";

import { build as buildID, FormMultilineTextField } from "@cyverse-de/ui-lib";

export default function InfoTextField(props) {
    const { baseId, fieldName } = props;

    const { t } = useTranslation("app_param_types");

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.LABEL)}
            name={`${fieldName}.label`}
            label={t(AppParamTypes.INFO)}
            component={FormMultilineTextField}
        />
    );
}
