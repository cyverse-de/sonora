import React from "react";

import { Field } from "formik";

import { FormTimestampField } from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";

const MODIFIED_TYPE = "modified";
const CREATED_TYPE = "created";
const DATE_ARGS_DEFAULT = { from: "", to: "" };
const MODIFIED_ARGS_DEFAULT = DATE_ARGS_DEFAULT;
const CREATED_ARGS_DEFAULT = DATE_ARGS_DEFAULT;

function Date(props) {
    const {
        parentId,
        field: { name },
    } = props;

    const { t } = useTranslation("search");

    return (
        <>
            <Field
                name={`${name}.from`}
                helperText={t("startDate")}
                id={buildID(parentId, ids.FROM_DATE)}
                component={FormTimestampField}
            />
            <Field
                name={`${name}.to`}
                helperText={t("endDate")}
                id={buildID(parentId, ids.TO_DATE)}
                component={FormTimestampField}
            />
        </>
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
};
