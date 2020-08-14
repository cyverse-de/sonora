/**
 * A dialog that allows users to rename an analysis.
 *
 * @author psarando
 */
import React from "react";

import { Field, Form, Formik } from "formik";
import { useTranslation } from "i18n";

import { validateDiskResourceName } from "../data/utils";

import ids from "./ids";
import UtilIds from "../utils/ids.js";

import { build, FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
} from "@material-ui/core";

function RenameAnalysisDialog(props) {
    const { open, isLoading, onClose, handleRename, selectedAnalysis } = props;

    // Using separate hooks so that analyses and data message keys
    // don't require a prefix.
    const { t } = useTranslation(["analyses", "common"]);
    const { t: dataI18N } = useTranslation("data");

    const baseId = ids.DIALOG.RENAME;

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(name, dataI18N);
        return validationError ? { name: validationError } : {};
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: selectedAnalysis?.id,
                name: selectedAnalysis?.name,
            }}
            validate={validate}
            onSubmit={handleRename}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <Dialog
                            open={open}
                            onClose={onClose}
                            maxWidth="sm"
                            fullWidth
                        >
                            <DialogTitle>{t("renameDlgHeader")}</DialogTitle>
                            <DialogContent>
                                <Field
                                    id={build(baseId, ids.NAME)}
                                    name="name"
                                    required={true}
                                    label={t("renamePrompt")}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSubmit();
                                        }
                                    }}
                                    InputProps={{
                                        readOnly: isLoading,
                                        endAdornment: isLoading && (
                                            <InputAdornment position="start">
                                                <CircularProgress
                                                    id={build(
                                                        baseId,
                                                        UtilIds.LOADING_SKELETON
                                                    )}
                                                    color="inherit"
                                                    size={20}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    component={FormTextField}
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    id={build(baseId, UtilIds.DIALOG.CANCEL)}
                                    onClick={onClose}
                                >
                                    {t("common:cancel")}
                                </Button>
                                <Button
                                    id={build(baseId, UtilIds.DIALOG.CONFIRM)}
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {t("common:ok")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default RenameAnalysisDialog;
