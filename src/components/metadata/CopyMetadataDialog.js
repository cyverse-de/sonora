/**
 * @author sriram
 *
 * A dialog that allows users to copy metadata of a file / folder
 * to selected list of file(s) and folder(s)
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Field, FieldArray, Form, Formik } from "formik";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import constants from "../../constants";
import DEDialog from "components/utils/DEDialog";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { Button, CircularProgress, Typography } from "@material-ui/core";

export default function CopyMetadataDialog(props) {
    const {
        open,
        handleClose,
        baseId,
        resourceToCopyFrom,
        copyStatus,
        error,
        doCopy
    } = props;
    const { t } = useTranslation("metadata");
    const { t: i18nCommon } = useTranslation("common");
    const handleSubmit = (values) => {
        console.log("values=>" + JSON.stringify(values));
        doCopy();
    };
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
                            title="Copy Metadata"
                            actions={
                                <>
                                    <Button
                                        id={build(baseId, ids.CANCEL_BTN)}
                                        onClick={handleClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(baseId, ids.SUBMIT_BTN)}
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
                                    resourceToCopyFrom,
                                })}
                            </Typography>
                            {copyStatus === constants.LOADING && (
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
                                    errorMessage={t("publicationRequestFailed")}
                                    errorObject={error}
                                />
                            )}

                            <Field
                                name="selectedResources"
                                label={t("copyMetadataInputLabel")}
                                id={build(baseId, "")}
                                required={true}
                                height="25vh"
                                component={MultiInputSelector}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
