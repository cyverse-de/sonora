/**
 * A form component for editing App `Flag` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../ids";

import DescriptionField from "./common/DescriptionField";
import LabelField from "./common/LabelField";
import VisibleField from "./common/VisibleField";

import {
    build as buildID,
    FormCheckbox,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Grid } from "@material-ui/core";

export default function CheckboxPropertyFields(props) {
    const { baseId, cosmeticOnly, fieldName } = props;

    const { t } = useTranslation("app_editor");

    return (
        <Grid container>
            <Grid item xs={12}>
                <LabelField baseId={baseId} fieldName={fieldName} />
            </Grid>
            <Grid
                item
                xs={12}
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.CHECKED_OPTION)}
                        name={`${fieldName}.name.checked.option`}
                        label={t("checkboxArgOptionCheckedLabel")}
                        margin="normal"
                        required
                        component={FormTextField}
                        disabled={cosmeticOnly}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.CHECKED_VALUE)}
                        name={`${fieldName}.name.checked.value`}
                        label={t("checkboxArgValueCheckedLabel")}
                        margin="normal"
                        component={FormTextField}
                        disabled={cosmeticOnly}
                    />
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.UNCHECKED_OPTION)}
                        name={`${fieldName}.name.unchecked.option`}
                        label={t("checkboxArgOptionUncheckedLabel")}
                        required
                        margin="normal"
                        component={FormTextField}
                        disabled={cosmeticOnly}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FastField
                        id={buildID(baseId, ids.PARAM_FIELDS.UNCHECKED_VALUE)}
                        name={`${fieldName}.name.unchecked.value`}
                        label={t("checkboxArgValueUncheckedLabel")}
                        margin="normal"
                        component={FormTextField}
                        disabled={cosmeticOnly}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FastField
                    id={buildID(baseId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                    name={`${fieldName}.defaultValue`}
                    label={t("checkboxDefaultLabel")}
                    component={FormCheckbox}
                    disabled={cosmeticOnly}
                />

                <DescriptionField baseId={baseId} fieldName={fieldName} />

                <VisibleField
                    baseId={baseId}
                    fieldName={fieldName}
                    disabled={cosmeticOnly}
                />
            </Grid>
        </Grid>
    );
}
