/**
 * @author sriram
 *
 * A dialog that allows users to apply metadata in bulk to children of a folder
 * from a metadata csv file
 *
 */

import React from "react";
import { useMutation } from "react-query";
import { useTranslation } from "i18n";
import { Field, Form, Formik } from "formik";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import ids from "./ids";
import constants from "../../constants";
import { nonEmptyField } from "components/utils/validations";
import DEDialog from "components/utils/DEDialog";
import FileInput from "components/apps/launch/params/FileInput";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { applyBulkMetadataFromFile } from "serviceFacades/metadata";

import { Button, CircularProgress, Typography, useTheme } from "@mui/material";

export default function ApplyBulkMetadataDialog(props) {
    const { open, handleClose, destFolder } = props;
    const theme = useTheme();
    const { t } = useTranslation("metadata");
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18nUtil } = useTranslation("util");

    const [error, setError] = React.useState();

    const baseId = ids.BULK_METADATA_DIALOG;
    const { mutate: applyMetadata, status: bulkStatus } = useMutation(
        applyBulkMetadataFromFile,
        {
            onSuccess: () => {
                announce({
                    text: t("metadataApplied"),
                    variant: SUCCESS,
                });
                handleClose();
            },
            onError: setError,
        }
    );

    const handleSubmit = (values) => {
        if (bulkStatus !== constants.LOADING) {
            applyMetadata({ sourceFile: values.metadataFile, destFolder });
        }
    };

    return (
        <Formik
            initialValues={{
                metadataFile: "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit, values }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            maxWidth="sm"
                            onClose={handleClose}
                            baseId={baseId}
                            title={t("applyBulkTitle")}
                            actions={
                                <>
                                    <Button
                                        id={buildID(baseId, ids.CANCEL_BUTTON)}
                                        onClick={handleClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={buildID(baseId, ids.COPY_BUTTON)}
                                        type="submit"
                                        variant="contained"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("done")}
                                    </Button>
                                </>
                            }
                        >
                            <Typography>
                                {t("applyBulkPrompt", {
                                    destFolder,
                                })}
                            </Typography>
                            {bulkStatus === constants.LOADING && (
                                <CircularProgress
                                    size={30}
                                    thickness={5}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                    }}
                                />
                            )}
                            {error && (
                                <ErrorTypographyWithDialog
                                    errorMessage={t("bulkMetadataFailure")}
                                    errorObject={error}
                                />
                            )}
                            <Field
                                name="metadataFile"
                                label={t("metadataFile")}
                                id={buildID(baseId, ids.METADATA_FILE)}
                                required={true}
                                component={FileInput}
                                style={{ marginBottom: theme.spacing(4) }}
                                validate={(value) =>
                                    nonEmptyField(value, i18nUtil)
                                }
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
