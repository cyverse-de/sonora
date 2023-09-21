/**
 * @author aramsey
 *
 * The clause for handling metadata attributes and values in an advanced
 * data search.
 *
 * Both values can be filled out, or just one.
 */
import React from "react";

import { FastField } from "formik";

import { FormTextField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";
import { Grid } from "@mui/material";

const METADATA_TYPE = "metadata";
const METADATA_ARGS_DEFAULT = { attribute: "", value: "" };

// remove any empty values
const formatMetadataVals = (clause) => {
    let filteredValues = { ...clause };
    let args = filteredValues.args;

    if (!args.attribute && !args.value) {
        return null;
    }

    if (!args.attribute) {
        delete filteredValues.args.attribute;
    }
    if (!args.value) {
        delete filteredValues.args.value;
    }

    return filteredValues;
};

function Metadata(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <Grid container spacing={1}>
            <Grid item>
                <FastField
                    name={`${name}.attribute`}
                    label={t("attribute")}
                    id={buildID(parentId, ids.METADATA_ATTRIBUTE)}
                    fullWidth={false}
                    component={FormTextField}
                />
            </Grid>
            <Grid item>
                <FastField
                    name={`${name}.value`}
                    label={t("value")}
                    id={buildID(parentId, ids.METADATA_VALUE)}
                    fullWidth={false}
                    component={FormTextField}
                />
            </Grid>
        </Grid>
    );
}

export default Metadata;
export { METADATA_ARGS_DEFAULT, METADATA_TYPE, formatMetadataVals };
