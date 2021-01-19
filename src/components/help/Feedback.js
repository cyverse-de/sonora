/**
 * @author sriram
 *
 * A dialog that allows users to submit feedback
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";
import { Field, Form, Formik } from "formik";

import { feedback } from "serviceFacades/users";
import { nonEmptyField } from "components/utils/validations";
import constants from "../../constants";

import { useUserProfile } from "contexts/userProfile";
import {
    build,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";

import DEDialog from "components/utils/DEDialog";
import {
    Button,
    CircularProgress,
    InputAdornment,
    Typography,
} from "@material-ui/core";

export default function Feedback(props) {
    const { open, baseId, title, onClose } = props;
    const { isLoading } = false;
    const [userProfile] = useUserProfile();

    const { t } = useTranslation("util");
    const { t: i18nHelp } = useTranslation("help");

    const [sendFeedback, { status: feedbackStatus }] = useMutation(feedback, {
        onSuccess: () => console.log("feedback submitted!"),
        onError: () => console.log("Error submitting feedback"),
    });

    const onSubmit = (values) => {
        console.log("submit feedback now" + JSON.stringify(values));
        const submission = {
            email: values.email || "no-reply@cyverse.org",
            fields: {
                feedback: values.feedback,
            },
            subject: `feedback from ${values.name}`,
        };
        sendFeedback(submission);
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
                                        id={build(baseId, "name")}
                                        name={"name"}
                                        required={true}
                                        component={FormTextField}
                                        validate={(value) =>
                                            nonEmptyField(value, t)
                                        }
                                        label={i18nHelp("name")}
                                    />
                                    <Field
                                        id={build(baseId, "email")}
                                        name="email"
                                        required={false}
                                        component={FormTextField}
                                        label={i18nHelp("email")}
                                        validate={(value) =>
                                            nonEmptyField(value, t)
                                        }
                                        helperText={i18nHelp("feedback_helper")}
                                    />
                                </>
                            )}
                            <Field
                                id={build(baseId, "feedback")}
                                name="feedback"
                                label="Feedback"
                                required={true}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSubmit();
                                    }
                                }}
                                validate={(value) => nonEmptyField(value, t)}
                                InputProps={{
                                    readOnly: isLoading,
                                    endAdornment: (
                                        <>
                                            {isLoading && (
                                                <InputAdornment position="start">
                                                    <CircularProgress
                                                        id={build(
                                                            baseId,
                                                            "feedback_progress"
                                                        )}
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
