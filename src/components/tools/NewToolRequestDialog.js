import React from "react";

import { useTranslation } from "i18n";
import { useMutation } from "react-query";

import { Field, Form, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";
import ids from "./ids";
import constants from "./constants";
import { toolRequest } from "serviceFacades/tools";

import {
    build,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import Button from "@material-ui/core/Button";

export default function NewToolRequestDialog(props) {
    const { open, baseId, onClose } = props;

    const { t } = useTranslation("tools");

    const [submitNewToolRequest, { status: submitRequestStatus }] = useMutation(
        ({ submission }) => toolRequest(submission),
        {
            onSuccess: (data) => {
                console.log("request submitted");
            },
            onError: () => console.log("error submitting request"),
        }
    );

    const handleSubmit = (values, { props }) => {
        console.log("handle submit");
        //test_data_path and cmd_line are required by service. Most of the times those info. can be
        // found in the source repo. So copy the source url to those fields if not provided by user.
        if (!values.test_data_path) {
            values.test_data_path = values.source_url;
        }
        if (!values.cmd_line) {
            values.cmd_line = values.source_url;
        }
        const submission = { ...values };
        if (submitRequestStatus !== constants.LOADING) {
            submitNewToolRequest(submission);
        }
    };

    const validateUrl = (value) => {
        let error;
        if (!constants.URL_REGEX.test(value)) {
            error = t("validationErrMsgURL");
        }
        return error;
    };

    return (
        <DEDialog
            open={open}
            onClose={onClose}
            baseId={build(baseId, ids.TOOL_REQUEST.DIALOG)}
            title={t("newToolRequestDialogHeading")}
        >
            <Formik
                enableReinitialize={true}
                onSubmit={handleSubmit}
                render={({ errors, status, touched, isSubmitting }) => (
                    <Form>
                        <Field
                            name="name"
                            label={t("toolNameLabel")}
                            required={true}
                            margin="dense"
                            id={build(baseId, ids.TOOL_REQUEST.NAME)}
                            component={FormTextField}
                        />
                        <Field
                            name="description"
                            label={t("toolDescLabel")}
                            required={true}
                            margin="dense"
                            id={build(baseId, ids.TOOL_REQUEST.DESCRIPTION)}
                            component={FormMultilineTextField}
                        />
                        <Field
                            name="source_url"
                            label={t("toolSrcLinkLabel")}
                            required={true}
                            margin="dense"
                            validate={validateUrl}
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
                        />
                        <Field
                            name="documentation_url"
                            label={t("toolDocumentationLabel")}
                            required={true}
                            margin="dense"
                            id={build(baseId, ids.TOOL_REQUEST.DOCUMENTATION)}
                            validate={validateUrl}
                            component={FormTextField}
                        />
                        <Field
                            name="cmd_line"
                            label={t("toolInstructionsLabel")}
                            required={false}
                            margin="dense"
                            id={build(baseId, ids.TOOL_REQUEST.INSTRUCTIONS)}
                            component={FormMultilineTextField}
                        />
                        <Field
                            name="test_data_path"
                            label={t("toolTestDataLabel")}
                            required={false}
                            margin="dense"
                            id={build(baseId, ids.TOOL_REQUEST.TEST_DATA_LINK)}
                            component={FormTextField}
                        />
                        <Button
                            style={{ float: "right" }}
                            color="primary"
                            type="submit"
                            id={build(baseId, ids.BUTTONS.SUBMIT)}
                            aria-label={t("submit")}
                            disabled={isSubmitting}
                        >
                            {t("submit")}
                        </Button>
                    </Form>
                )}
            />
        </DEDialog>
    );
}
