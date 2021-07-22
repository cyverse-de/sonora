/**
 * A dialog that allows users to update analysis comments.
 *
 * @author psarando
 */
import React from "react";

import { Field, Form, Formik } from "formik";
import { useTranslation } from "i18n";

import ids from "./ids";

import UtilIds from "components/utils/ids.js";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
} from "@material-ui/core";

function AnalysisCommentDialog(props) {
    const {
        open,
        isLoading,
        submissionError,
        onClose,
        handleUpdateComment,
        selectedAnalysis,
    } = props;

    const { t } = useTranslation(["analyses", "common"]);

    const baseId = ids.DIALOG.COMMENT;

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: selectedAnalysis?.id,
                description: selectedAnalysis?.description,
            }}
            onSubmit={handleUpdateComment}
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
                            <DialogTitle>{t("commentsDlgHeader")}</DialogTitle>
                            <DialogContent>
                                <Field
                                    id={buildID(baseId, ids.COMMENTS)}
                                    name="description"
                                    label={t("commentsPrompt")}
                                    multiline
                                    rows={3}
                                    InputProps={{
                                        readOnly: isLoading,
                                        endAdornment: isLoading && (
                                            <InputAdornment position="start">
                                                <CircularProgress
                                                    id={buildID(
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
                                    helperText={
                                        submissionError && (
                                            <ErrorTypographyWithDialog
                                                baseId={baseId}
                                                errorMessage={t(
                                                    "analysisCommentError"
                                                )}
                                                errorObject={submissionError}
                                            />
                                        )
                                    }
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    id={buildID(baseId, UtilIds.DIALOG.CANCEL)}
                                    onClick={onClose}
                                >
                                    {t("common:cancel")}
                                </Button>
                                <Button
                                    id={buildID(baseId, UtilIds.DIALOG.CONFIRM)}
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

export default AnalysisCommentDialog;
