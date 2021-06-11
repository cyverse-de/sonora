/**
 * @author sriram
 *
 * A dialog that allows users to copy metadata of a file / folder
 * to selected list of file(s) and folder(s)
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Field, Form, Formik } from "formik";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import { nonEmptyField } from "components/utils/validations";
import DEDialog from "components/utils/DEDialog";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { Button, CircularProgress, Typography } from "@material-ui/core";

export default function CopyMetadataDialog(props) {
    const { open, handleClose, resourceToCopyFrom, copying, error, doCopy } =
        props;
    const { t } = useTranslation("metadata");
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18nUtil } = useTranslation("util");
    const handleSubmit = (values) => {
        const { selectedResources } = values;
        const destination_ids = selectedResources?.map(
            (resource) => resource.id
        );
        doCopy({ source_id: resourceToCopyFrom?.id, destination_ids });
    };
    const baseId = ids.COPY_DIALOG;
    return (
        <Formik
            initialValues={{
                selectedResources: [],
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
                            title={t("copyMetadata")}
                            actions={
                                <>
                                    <Button
                                        id={build(baseId, ids.CANCEL_BUTTON)}
                                        onClick={handleClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(baseId, ids.COPY_BUTTON)}
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("copy")}
                                    </Button>
                                </>
                            }
                        >
                            <Typography>
                                {t("copyPrompt", {
                                    resourceToCopyFrom:
                                        resourceToCopyFrom?.path,
                                })}
                            </Typography>
                            {copying && (
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
                                    errorMessage={t("copyFailure")}
                                    errorObject={error}
                                />
                            )}

                            <Field
                                name="selectedResources"
                                label={t("copyMetadataInputLabel")}
                                id={build(baseId, ids.SELECTED_RESOURCES)}
                                required={true}
                                height="25vh"
                                component={MultiInputSelector}
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
