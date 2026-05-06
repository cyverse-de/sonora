/**
 * VICE Admin — Operators editor dialog.
 *
 * Add / edit form for a registered operator. Live validation: every keystroke
 * is run through `validateOperator`, errors are translated and surfaced via
 * MUI TextField helperText. The Save button is disabled until the draft is
 * valid.
 *
 * @author your-name
 */
import React, { useEffect, useMemo, useState } from "react";

import { useTranslation } from "i18n";

import {
    Button,
    FormControlLabel,
    InputAdornment,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import DEDialog from "components/utils/DEDialog";

import { id, validateOperator } from "./functions";
import ids from "./ids";

const BLANK_OPERATOR = {
    name: "",
    url: "",
    skipTlsVerify: false,
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

    const [draft, setDraft] = useState(BLANK_OPERATOR);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (open) {
            setDraft(
                initial ? { ...BLANK_OPERATOR, ...initial } : BLANK_OPERATOR
            );
            setTouched({});
        }
    }, [open, initial]);

    const errors = useMemo(
        () => validateOperator(draft, allOperators, initial?.id),
        [draft, allOperators, initial]
    );
    const isValid = Object.keys(errors).length === 0;
    const errorCount = Object.keys(errors).length;

    // Show an error message only after the user has typed in / blurred a field,
    // so they don't see "Name is required" the instant the dialog opens.
    const errorFor = (field) => {
        if (!touched[field]) return null;
        const e = errors[field];
        return e ? t(e.key, e.values) : null;
    };

    const set = (field, value) => {
        setDraft((d) => ({ ...d, [field]: value }));
        setTouched((tch) => ({ ...tch, [field]: true }));
    };
    const markTouched = (field) =>
        setTouched((tch) => ({ ...tch, [field]: true }));

    const handleSave = () => {
        if (!isValid) return;
        onSave({
            ...draft,
            name: draft.name.trim(),
            url: draft.url.trim(),
            priority: Number(draft.priority),
        });
    };

    const dialogId = id(ids.DIALOG);
    const titleKey = isEdit ? "editOperator" : "registerOperator";

    return (
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
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        disabled={!isValid || saving}
                    >
                        {isEdit ? t("save") : t("registerOperator")}
                    </Button>
                </>
            }
        >
            <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                    id={id(ids.DIALOG_NAME)}
                    label={t("operatorName")}
                    variant="standard"
                    fullWidth
                    required
                    inputProps={{ spellCheck: false, maxLength: 63 }}
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => markTouched("name")}
                    error={!!errorFor("name")}
                    helperText={errorFor("name") || t("operatorNameHelper")}
                    placeholder="vice-runtime-operator"
                />

                <TextField
                    id={id(ids.DIALOG_URL)}
                    label={t("operatorUrl")}
                    variant="standard"
                    fullWidth
                    required
                    inputProps={{ spellCheck: false }}
                    value={draft.url}
                    onChange={(e) => set("url", e.target.value)}
                    onBlur={() => markTouched("url")}
                    error={!!errorFor("url")}
                    helperText={errorFor("url") || t("operatorUrlHelper")}
                    placeholder="https://operator.cyverse.org/api"
                />

                <TextField
                    id={id(ids.DIALOG_PRIORITY)}
                    label={t("operatorPriority")}
                    variant="standard"
                    type="number"
                    required
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
                    sx={{ width: { xs: "100%", sm: "20ch" } }}
                    value={draft.priority}
                    onChange={(e) => set("priority", e.target.value)}
                    onBlur={() => markTouched("priority")}
                    error={!!errorFor("priority")}
                    helperText={
                        errorFor("priority") || t("operatorPriorityHelper")
                    }
                />

                <FormControlLabel
                    control={
                        <Switch
                            id={id(ids.DIALOG_SKIP_TLS)}
                            checked={!!draft.skipTlsVerify}
                            onChange={(e) =>
                                set("skipTlsVerify", e.target.checked)
                            }
                            color="warning"
                        />
                    }
                    label={
                        <span>
                            <Typography variant="body2" component="span">
                                {t("operatorSkipTlsVerify")}
                            </Typography>
                            <Typography
                                variant="caption"
                                component="div"
                                color={
                                    draft.skipTlsVerify
                                        ? "warning.main"
                                        : "text.secondary"
                                }
                            >
                                {draft.skipTlsVerify
                                    ? t("operatorSkipTlsVerifyOnHelp")
                                    : t("operatorSkipTlsVerifyOffHelp")}
                            </Typography>
                        </span>
                    }
                />

                {!isValid && (
                    <Typography variant="caption" color="error">
                        {t("operatorFieldsNeedAttention", {
                            count: errorCount,
                        })}
                    </Typography>
                )}
            </Stack>
        </DEDialog>
    );
};

export default OperatorEditor;
