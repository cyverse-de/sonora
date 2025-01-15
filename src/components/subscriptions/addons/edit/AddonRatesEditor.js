/**
 * Form fields for adding, editing, and deleting app addon rates.
 *
 * @author sarahr
 */

import React from "react";
import { useTranslation } from "i18n";
import {
    Button,
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
import { Add, Delete } from "@mui/icons-material";

import ids from "../../ids";

function AddonRateEditorRow(props) {
    const { baseId, fieldName, key, onDelete } = props;
    const { t: i18nUtil } = useTranslation("util");
    const { t } = useTranslation(["common"]);

    return (
        <TableRow>
            <TableCell>
                <Field
                    component={FormNumberField}
                    id={buildID(baseId, ids.ADDONS_DLG.ADDON_RATE.RATE)}
                    name={`${fieldName}.rate`}
                    required
                    validate={(value) => minValue(value, i18nUtil)}
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
                    validate={(value) => nonEmptyField(value, i18nUtil)}
                />
            </TableCell>
            <TableCell passing="none">
                <Button
                    id={buildID(baseId, ids.DELETE_BUTTON)}
                    aria-label={t("common:delete")}
                    onClick={onDelete}
                >
                    <Delete />
                </Button>
            </TableCell>
        </TableRow>
    );
}

function AddonRatesEditor(props) {
    const { addonRates, baseId, fieldName, onAdd, onDelete } = props;

    const { t } = useTranslation(["subscriptions", "common"]);

    return (
        <>
            <TableContainer>
                <Table>
                    <Typography component="caption">
                        {t("subscriptions:addonRates")}
                    </Typography>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography>
                                    {t("subscriptions:rate")}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {t("subscriptions:effectiveDate")}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Button
                                    id={buildID(baseId, ids.ADD_BUTTON)}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={onAdd}
                                >
                                    {t("common:add")}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {addonRates?.map((addonRate, index) => (
                            <AddonRateEditorRow
                                addonRate={addonRate}
                                baseId={buildID(baseId, index)}
                                fieldName={`${fieldName}.${index}`}
                                key={index}
                                onDelete={() => onDelete(index)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default AddonRatesEditor;
