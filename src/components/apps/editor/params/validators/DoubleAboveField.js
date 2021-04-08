/**
 * Form field for editing App validator rule DoubleAbove params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import { build as buildID, FormNumberField } from "@cyverse-de/ui-lib";

export default function DoubleAboveField(props) {
    const { baseId, fieldName } = props;

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
            name={`${fieldName}.params.0`}
            component={FormNumberField}
        />
    );
}
