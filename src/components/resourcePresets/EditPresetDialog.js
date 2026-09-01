import React from "react";
import { Formik, Field, Form } from "formik";
import { useTranslation } from "i18n";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormNumberField from "components/forms/FormNumberField";
import FormSwitch from "components/forms/FormSwitch";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

const GIB = 1073741824;

function EditPresetDialog({ open, onClose, preset, onSave }) {
    const { t } = useTranslation("resourcePresets");
    const baseId = ids.EDIT_DIALOG;

    const initialValues = {
        label: preset?.label || "",
        description: preset?.description || "",
        max_cpu_cores: preset?.max_cpu_cores || "",
        min_memory_limit_gib: preset?.min_memory_limit
            ? preset.min_memory_limit / GIB
            : "",
        max_gpus: preset?.max_gpus ?? 0,
        time_limit_seconds: preset?.time_limit_seconds || "",
        display_order: preset?.display_order ?? 0,
        is_enabled: preset?.is_enabled ?? true,
    };

    const handleValidate = (values) => {
        const errors = {};
        if (!values.label) {
            errors.label = t("required");
        }
        if (!values.max_cpu_cores && values.max_cpu_cores !== 0) {
            errors.max_cpu_cores = t("required");
        } else if (Number(values.max_cpu_cores) <= 0) {
            errors.max_cpu_cores = t("mustBePositive");
        }
        if (!values.min_memory_limit_gib && values.min_memory_limit_gib !== 0) {
            errors.min_memory_limit_gib = t("required");
        } else if (Number(values.min_memory_limit_gib) <= 0) {
            errors.min_memory_limit_gib = t("mustBePositive");
        }
        if (values.max_gpus !== "" && Number(values.max_gpus) < 0) {
            errors.max_gpus = t("mustBeNonNegative");
        }
        if (
            values.time_limit_seconds !== "" &&
            values.time_limit_seconds !== null &&
            Number(values.time_limit_seconds) <= 0
        ) {
            errors.time_limit_seconds = t("mustBePositive");
        }
        return errors;
    };

    const handleSubmit = (values) => {
        const { min_memory_limit_gib, ...rest } = values;
        const isUpdate = !!preset;
        const result = {
            label: rest.label,
            max_cpu_cores: Number(rest.max_cpu_cores),
            min_memory_limit: Math.round(min_memory_limit_gib * GIB),
            max_gpus: rest.max_gpus !== "" ? Number(rest.max_gpus) : 0,
            display_order:
                rest.display_order !== "" ? Number(rest.display_order) : 0,
            is_enabled: rest.is_enabled,
        };
        // For updates, send null to clear nullable fields.
        // For creates, omit the key entirely (backend uses column defaults).
        if (rest.description) {
            result.description = rest.description;
        } else if (isUpdate) {
            result.description = null;
        }
        if (rest.time_limit_seconds !== "" && rest.time_limit_seconds != null) {
            result.time_limit_seconds = Number(rest.time_limit_seconds);
        } else if (isUpdate) {
            result.time_limit_seconds = null;
        }
        onSave(result);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validate={handleValidate}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit: formikSubmit }) => (
                    <Form>
                        <DialogTitle>
                            {preset ? t("editPreset") : t("newPreset")}
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                pt: 1,
                            }}
                        >
                            <Field
                                id={buildID(baseId, ids.LABEL_FIELD)}
                                name="label"
                                label={t("label")}
                                required
                                component={FormTextField}
                            />
                            <Field
                                id={buildID(baseId, ids.DESCRIPTION_FIELD)}
                                name="description"
                                label={t("description")}
                                component={FormTextField}
                            />
                            <Field
                                id={buildID(baseId, ids.CPU_FIELD)}
                                name="max_cpu_cores"
                                label={t("cpuCores")}
                                required
                                component={FormNumberField}
                            />
                            <Field
                                id={buildID(baseId, ids.MEMORY_FIELD)}
                                name="min_memory_limit_gib"
                                label={t("memory")}
                                required
                                component={FormNumberField}
                            />
                            <Field
                                id={buildID(baseId, ids.GPU_FIELD)}
                                name="max_gpus"
                                label={t("gpus")}
                                component={FormNumberField}
                            />
                            <Field
                                id={buildID(baseId, ids.TIME_LIMIT_FIELD)}
                                name="time_limit_seconds"
                                label={t("timeLimit")}
                                component={FormNumberField}
                            />
                            <Field
                                id={buildID(baseId, ids.DISPLAY_ORDER_FIELD)}
                                name="display_order"
                                label={t("displayOrder")}
                                component={FormNumberField}
                            />
                            <Field
                                id={buildID(baseId, ids.ENABLED_SWITCH)}
                                name="is_enabled"
                                label={t("enabled")}
                                component={FormSwitch}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>{t("cancel")}</Button>
                            <Button variant="contained" onClick={formikSubmit}>
                                {t("save")}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default EditPresetDialog;
