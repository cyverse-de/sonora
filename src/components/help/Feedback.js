/**
 * @author sriram
 *
 * A dialog that allows users to submit feedback
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";
import { Field, Form, Formik } from "formik";

import ids from "./ids";
import { feedback } from "serviceFacades/users";
import { nonEmptyField } from "components/utils/validations";
import constants from "../../constants";

import { useUserProfile } from "contexts/userProfile";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import DEDialog from "components/utils/DEDialog";

import {
    build,
    AnnouncerConstants,
    announce,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    InputAdornment,
    Typography,
} from "@material-ui/core";

export default function Feedback(props) {
    const { open, title, onClose } = props;
    const { isLoading } = false;
    const [userProfile] = useUserProfile();
    const [error, setError] = useState();

    const { t } = useTranslation("util");
    const { t: i18nHelp } = useTranslation("help");

    const baseId = ids.FEEDBACK_DLG;

    const [sendFeedback, { status: feedbackStatus }] = useMutation(feedback, {
        onSuccess: () => {
            announce({
                text: i18nHelp("feedback_success"),
                variant: AnnouncerConstants.SUCCESS,
            });
        },
        onError: setError,
    });

    const onSubmit = (values) => {
        const submission = {
            email: values.email || constants.DEFAULT_EMAIL,
            fields: {
                feedback: values.feedback,
            },
            subject: i18nHelp("email_subject", { name: values.name }),
        };
        sendFeedback(submission);
    };

    const validateEmail = (value) => {
        let error;
        if (value && !constants.EMAIL_REGEX.test(value)) {
            error = i18nHelp("email_validation_error");
        }
        return error;
    };

    return (
        <Formik
            enableReinitialize
            onSubmit={onSubmit}
            initialValues={{
                name: userProfile?.attributes.name,
                email: userProfile?.attributes.email,
                feedback: "",
            }}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            title={title}
                            onClose={onClose}
                            actions={
                                <>
                                    <Button onClick={onClose}>
                                        {i18nHelp("cancel")}
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nHelp("submit_feedback")}
                                    </Button>
                                </>
                            }
                        >
                            {error && (
                                <ErrorTypographyWithDialog
                                    errorMessage={i18nHelp("feedback_error")}
                                    errorObject={error}
                                />
                            )}
                            <Typography>
                                {i18nHelp("feedback_welcome")}
                            </Typography>

                            {feedbackStatus === constants.LOADING && (
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
                            {!userProfile?.id && (
                                <>
                                    <Field
                                        id={build(baseId, ids.NAME)}
                                        name={"name"}
                                        required={true}
                                        component={FormTextField}
                                        validate={(value) =>
                                            nonEmptyField(value, t)
                                        }
                                        label={i18nHelp("name")}
                                    />
                                    <Field
                                        id={build(baseId, ids.EMAIL)}
                                        name="email"
                                        required={false}
                                        component={FormTextField}
                                        label={i18nHelp("email")}
                                        validate={validateEmail}
                                        helperText={i18nHelp("feedback_helper")}
                                    />
                                </>
                            )}
                            <Field
                                id={build(baseId, ids.FEEDBACK)}
                                name="feedback"
                                label={i18nHelp("feedback_title")}
                                required={true}
                                validate={(value) => nonEmptyField(value, t)}
                                InputProps={{
                                    readOnly: isLoading,
                                    endAdornment: (
                                        <>
                                            {isLoading && (
                                                <InputAdornment position="start">
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                </InputAdornment>
                                            )}
                                        </>
                                    ),
                                }}
                                component={FormMultilineTextField}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
