/**
 * Form field for editing App validator rule Regex params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

export default function RegexField(props) {
    const { baseId, fieldName, ...custom } = props;

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
            name={`${fieldName}.params.0`}
            component={FormTextField}
            {...custom}
        />
    );
}
