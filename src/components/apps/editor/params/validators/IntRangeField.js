/**
 * Form field for editing App validator rule IntRange params.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import ids from "../../ids";

import { build as buildID, FormIntegerField } from "@cyverse-de/ui-lib";

import { Grid } from "@material-ui/core";

export default function IntRangeField(props) {
    const { baseId, fieldName } = props;

    return (
        <Grid container wrap="nowrap">
            <FastField
                id={buildID(baseId, 0, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.0`}
                component={FormIntegerField}
            />
            <FastField
                id={buildID(baseId, 1, ids.PARAM_FIELDS.ARGUMENT_OPTION)}
                name={`${fieldName}.params.1`}
                component={FormIntegerField}
            />
        </Grid>
    );
}
