/**
 * Form fields for adding, editing, and deleting app addon rates.
 *
 * @author sarahr
 */

import React from "react";
import { useTranslation } from "i18n";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import {
    FormNumberField,
    FormTimestampField,
} from "components/forms/FormField";
import buildID from "components/utils/DebugIDUtil";
import { minValue, nonEmptyField } from "components/utils/validations";
import { Field } from "formik";

import ids from "../../ids";

function AddonRateEditorRow(props) {
    const { baseId, fieldName } = props;
    const { t } = useTranslation("util");

    return (
        <TableRow>
            <TableCell>
                <Field
                    component={FormNumberField}
                    id={buildID(baseId, ids.ADDONS_DLG.ADDON_RATE.RATE)}
                    name={`${fieldName}.rate`}
                    required
                    validate={(value) => minValue(value, t)}
                />
            </TableCell>
            <TableCell>
                <Field
                    component={FormTimestampField}
                    id={buildID(
                        baseId,
                        ids.ADDONS_DLG.ADDON_RATE.EFFECTIVE_DATE
                    )}
                    name={`${fieldName}.effectiveDate`}
                    required
                    validate={(value) => nonEmptyField(value, t)}
                />
            </TableCell>
        </TableRow>
    );
}

function AddonRatesEditor(props) {
    const { addonRates, baseId, fieldName } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <>
            <TableContainer>
                <Table>
                    <Typography component="caption">
                        {t("addonRates")}
                    </Typography>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("rate")}</TableCell>
                            <TableCell>{t("effectiveDate")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {addonRates?.map((addonRate, index) => (
                            <AddonRateEditorRow
                                addonRate={addonRate}
                                baseId={buildID(baseId, index)}
                                fieldName={`${fieldName}.${index}`}
                                key={index}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default AddonRatesEditor;
