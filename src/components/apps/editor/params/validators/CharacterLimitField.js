/**
 * Form field for editing App validator rule CharacterLimit params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormIntegerField from "components/forms/FormIntegerField";

export default function CharacterLimitField(props) {
    const { baseId, fieldName, ...custom } = props;

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
            name={`${fieldName}.params.0`}
            component={FormIntegerField}
            {...custom}
        />
    );
}
