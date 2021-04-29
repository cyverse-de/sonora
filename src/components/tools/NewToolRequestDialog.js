/**
 * @author sriram
 */
import React, { useState } from "react";

import { useTranslation } from "i18n";
import { useMutation } from "react-query";

import { Field, Form, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import ids from "./ids";
import constants from "../../constants";
import { toolRequest } from "serviceFacades/tools";
import { nonEmptyField, urlField } from "components/utils/validations";

import {
    build,
    announce,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import Button from "@material-ui/core/Button";

export default function NewToolRequestDialog(props) {
    const { open, onClose } = props;
    const [requestError, setRequestError] = useState();

    const { t } = useTranslation("tools");
    const { t: i18nUtil } = useTranslation("utils");
    const baseId = ids.TOOL_REQUEST.DIALOG;

    const [submitNewToolRequest, { status: submitRequestStatus }] = useMutation(
        ({ submission }) => toolRequest(submission),
        {
            onSuccess: (data) => {
                announce({
                    text: t("toolRequestSuccess"),
                });
                onClose();
            },
            onError: setRequestError,
        }
    );

    const handleSubmit = (values, { props }) => {
        const submission = { ...values };
        //test_data_path and cmd_line are required by service. Most of the times those info. can be
        // found in the source repo. So copy the source url to those fields if not provided by user.
        if (!values.test_data_path) {
            submission.test_data_path = values.source_url;
        }
        if (!values.cmd_line) {
            submission.cmd_line = values.source_url;
        }
        if (submitRequestStatus !== constants.LOADING) {
            submitNewToolRequest({ submission });
        }
    };
    return (
        <Formik
            initialValues={{
                name: "",
                description: "",
                source_url: "",
                version: "",
                documentation_url: "",
                cmd_line: "",
                test_data_path: "",
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={t("newToolRequestDialogHeading")}
                            actions={
                                <Button
                                    color="primary"
                                    type="submit"
                                    id={build(baseId, ids.BUTTONS.SUBMIT)}
                                    aria-label={t("submit")}
                                    onClick={handleSubmit}
                                >
                                    {t("submit")}
                                </Button>
                            }
                        >
                            {requestError && (
                                <ErrorTypographyWithDialog
                                    errorObject={requestError}
                                    errorMessage={t("toolRequestError")}
                                    baseId={baseId}
                                />
                            )}

                            <Field
                                name="name"
                                label={t("toolNameLabel")}
                                required={true}
                                margin="dense"
                                id={build(baseId, ids.TOOL_REQUEST.NAME)}
                                component={FormTextField}
                                validate={(value) => nonEmptyField(value, t)}
                            />
                            <Field
                                name="description"
                                label={t("toolDescLabel")}
                                required={true}
                                margin="dense"
                                id={build(baseId, ids.TOOL_REQUEST.DESCRIPTION)}
                                component={FormMultilineTextField}
                                validate={(value) => nonEmptyField(value, t)}
                            />
                            <Field
                                name="source_url"
                                label={t("toolSrcLinkLabel")}
                                required={true}
                                margin="dense"
                                validate={(value) => urlField(value, i18nUtil)}
                                id={build(baseId, ids.TOOL_REQUEST.SRC_LINK)}
                                component={FormTextField}
                            />
                            <Field
                                name="version"
                                label={t("toolVersionLabel")}
                                required={true}
                                margin="dense"
                                id={build(baseId, ids.TOOL_REQUEST.VERSION)}
                                component={FormTextField}
                                validate={(value) => nonEmptyField(value, t)}
                            />
                            <Field
                                name="documentation_url"
                                label={t("toolDocumentationLabel")}
                                required={true}
                                margin="dense"
                                id={build(
                                    baseId,
                                    ids.TOOL_REQUEST.DOCUMENTATION
                                )}
                                validate={(value) => urlField(value, i18nUtil)}
                                component={FormTextField}
                            />
                            <Field
                                name="cmd_line"
                                label={t("toolInstructionsLabel")}
                                required={false}
                                margin="dense"
                                id={build(
                                    baseId,
                                    ids.TOOL_REQUEST.INSTRUCTIONS
                                )}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name="test_data_path"
                                label={t("toolTestDataLabel")}
                                required={false}
                                margin="dense"
                                id={build(
                                    baseId,
                                    ids.TOOL_REQUEST.TEST_DATA_LINK
                                )}
                                component={FormTextField}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
