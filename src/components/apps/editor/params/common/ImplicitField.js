/**
 * A form component for editing App input/output `is_implicit` properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import { build as buildID, FormCheckbox } from "@cyverse-de/ui-lib";

export default function ImplicitField({ baseId, fieldName, ...props }) {
    const { t } = useTranslation("app_editor");

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.IMPLICIT)}
            name={`${fieldName}.is_implicit`}
            label={t("doNotPass")}
            component={FormCheckbox}
            {...props}
        />
    );
}
