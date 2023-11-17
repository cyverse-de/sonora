/**
 * Form field for editing App validator rule IntRange params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormIntegerField from "components/forms/FormIntegerField";

import { Grid } from "@mui/material";

export default function IntRangeField(props) {
    const { baseId, fieldName, ...custom } = props;

    return (
        <Grid container wrap="nowrap">
            <FastField
                id={buildID(baseId, 0, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.0`}
                component={FormIntegerField}
                {...custom}
            />
            <FastField
                id={buildID(baseId, 1, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.1`}
                component={FormIntegerField}
                {...custom}
            />
        </Grid>
    );
}
