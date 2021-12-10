import React from "react";

import { Field } from "formik";

import { FormTextField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";
import { Grid } from "@material-ui/core";

const METADATA_TYPE = "metadata";
const METADATA_ARGS_DEFAULT = { attribute: "", value: "" };

function Metadata(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <Grid container spacing={1}>
            <Grid item>
                <Field
                    name={`${name}.attribute`}
                    label={t("attribute")}
                    id={buildID(parentId, ids.METADATA_ATTRIBUTE)}
                    fullWidth={false}
                    component={FormTextField}
                />
            </Grid>
            <Grid item>
                <Field
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
export { METADATA_ARGS_DEFAULT, METADATA_TYPE };
