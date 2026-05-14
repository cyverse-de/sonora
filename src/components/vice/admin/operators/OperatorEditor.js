/**
 * VICE Admin — Operators editor dialog.
 *
 * Add / edit form for a registered operator, built on Formik. Validation runs
 * through the shared `validateOperator` helper; Formik blocks submission while
 * the draft is invalid and the Save button stays disabled until it is valid.
 *
 * @author johnworth, Claude Opus 4.7
 */
import React from "react";

import { useTranslation } from "i18n";

import { Button, InputAdornment, Typography } from "@mui/material";

import { Field, Form, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";
import FormTextField from "components/forms/FormTextField";
import FormSwitch from "components/forms/FormSwitch";

import { id, validateOperator } from "./functions";
import ids from "./ids";

const BLANK_OPERATOR = {
    name: "",
    url: "",
    tls_skip_verify: false,
    priority: "",
};

const OperatorEditor = ({
    open,
    mode = "add",
    initial,
    allOperators = [],
    onCancel,
    onSave,
    saving = false,
}) => {
    const { t } = useTranslation("vice-admin");
    const isEdit = mode === "edit";

    // Run the shared validator and translate its { key, values } results into
    // the plain message strings Formik expects.
    const validate = (values) => {
        const errs = validateOperator(values, allOperators, initial?.id);
        return Object.fromEntries(
            Object.entries(errs).map(([field, { key, values: v }]) => [
                field,
                t(key, v),
            ])
        );
    };

    const handleSubmit = (values) => {
        onSave({
            ...values,
            name: values.name.trim(),
            url: values.url.trim(),
            priority: Number(values.priority),
        });
    };

    const dialogId = id(ids.DIALOG);
    const titleKey = isEdit ? "editOperator" : "registerOperator";

    return (
        <Formik
            initialValues={
                initial ? { ...BLANK_OPERATOR, ...initial } : BLANK_OPERATOR
            }
            validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize
            validateOnMount
        >
            {({ handleSubmit, isValid }) => (
                <Form>
                    <DEDialog
                        baseId={dialogId}
                        open={open}
                        title={t(titleKey)}
                        onClose={onCancel}
                        maxWidth="sm"
                        actions={
                            <>
                                <Button
                                    id={id(ids.DIALOG_CANCEL)}
                                    onClick={onCancel}
                                    color="primary"
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    id={id(ids.DIALOG_SAVE)}
                                    type="submit"
                                    onClick={handleSubmit}
                                    color="primary"
                                    variant="contained"
                                    disabled={!isValid || saving}
                                >
                                    {isEdit ? t("save") : t("registerOperator")}
                                </Button>
                            </>
                        }
                    >
                        <Field
                            id={id(ids.DIALOG_NAME)}
                            name="name"
                            component={FormTextField}
                            label={t("operatorName")}
                            helperText={t("operatorNameHelper")}
                            required
                            inputProps={{ spellCheck: false, maxLength: 63 }}
                            placeholder="vice-runtime-operator"
                        />
                        <Field
                            id={id(ids.DIALOG_URL)}
                            name="url"
                            component={FormTextField}
                            label={t("operatorUrl")}
                            helperText={t("operatorUrlHelper")}
                            required
                            inputProps={{ spellCheck: false }}
                            placeholder="https://operator.cyverse.org/api"
                        />
                        <Field
                            id={id(ids.DIALOG_PRIORITY)}
                            name="priority"
                            component={FormTextField}
                            label={t("operatorPriority")}
                            helperText={t("operatorPriorityHelper")}
                            required
                            type="number"
                            inputProps={{ min: 0, max: 9999, step: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {t("operatorPriorityAdornment")}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            id={id(ids.DIALOG_SKIP_TLS)}
                            name="tls_skip_verify"
                            component={FormSwitch}
                            label={t("operatorSkipTlsVerify")}
                            color="warning"
                        />
                    </DEDialog>
                </Form>
            )}
        </Formik>
    );
};

export default OperatorEditor;
