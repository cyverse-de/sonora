/**
 * Form field for editing App validator rule DoubleRange params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormNumberField from "components/forms/FormNumberField";

import { Grid } from "@mui/material";

export default function DoubleRangeField(props) {
    const { baseId, fieldName, ...custom } = props;

    return (
        <Grid container wrap="nowrap">
            <FastField
                id={buildID(baseId, 0, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.0`}
                component={FormNumberField}
                {...custom}
            />
            <FastField
                id={buildID(baseId, 1, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.1`}
                component={FormNumberField}
                {...custom}
            />
        </Grid>
    );
}
