/**
 * @author aramsey
 *
 * The clause for handling modified or created dates when doing an advanced
 * data search.
 *
 * Either value can be omitted or both can be filled out.
 *
 */
import React from "react";

import { Grid } from "@mui/material";
import { getTime, parseISO } from "date-fns";
import { FastField } from "formik";

import { FormTimestampField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";

const MODIFIED_TYPE = "modified";
const CREATED_TYPE = "created";
const DATE_ARGS_DEFAULT = { from: "", to: "" };
const MODIFIED_ARGS_DEFAULT = DATE_ARGS_DEFAULT;
const CREATED_ARGS_DEFAULT = DATE_ARGS_DEFAULT;

// removes empty values and converts to milliseconds
const formatDateValues = (clause) => {
    // create copy of the clause, don't modify the original otherwise it
    // mutates the form
    let filteredValues = JSON.parse(JSON.stringify(clause));
    let args = filteredValues.args;

    if (!args.from && !args.to) {
        return null;
    }

    if (args.from) {
        filteredValues.args.from = getTime(
            parseISO(filteredValues.args.from)
        ).toString();
    } else {
        delete filteredValues.args.from;
    }

    if (args.to) {
        filteredValues.args.to = getTime(
            parseISO(filteredValues.args.to)
        ).toString();
    } else {
        delete filteredValues.args.to;
    }

    return filteredValues;
};

function Date(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <Grid container spacing={1}>
            <Grid item>
                <FastField
                    name={`${name}.from`}
                    helperText={t("startDate")}
                    id={buildID(parentId, ids.FROM_DATE)}
                    component={FormTimestampField}
                />
            </Grid>
            <Grid item>
                <FastField
                    name={`${name}.to`}
                    helperText={t("endDate")}
                    id={buildID(parentId, ids.TO_DATE)}
                    component={FormTimestampField}
                />
            </Grid>
        </Grid>
    );
}

function Modified(props) {
    const { parentId, ...rest } = props;
    const { t } = useTranslation("search");

    const id = buildID(parentId, ids.MODIFIED);

    return <Date label={t("modified")} parentId={id} {...rest} />;
}

function Created(props) {
    const { parentId, ...rest } = props;
    const { t } = useTranslation("search");

    const id = buildID(parentId, ids.CREATED);

    return <Date label={t("created")} parentId={id} {...rest} />;
}

export {
    Modified,
    Created,
    MODIFIED_TYPE,
    CREATED_TYPE,
    MODIFIED_ARGS_DEFAULT,
    CREATED_ARGS_DEFAULT,
    formatDateValues,
};
