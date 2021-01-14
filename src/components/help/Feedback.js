/**
 * @author sriram
 *
 * A dialog that allows users to submit feedback
 *
 */
import React from "react";
import { useMutation } from "react-query";

import { Field, Form, Formik } from "formik";
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
    const onSubmit = (values) => {
        console.log("submit feedback now" + values);
    };

    const {} = useMutation();

    return (
        <DEDialog
            open={open}
            title={title}
            onClose={onClose}
            actions={
                <>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="primary" type="submit" onClick={onSubmit}>
                        Submit Feedback
                    </Button>
                </>
            }
        >
            <Typography>
                All feedback welcome. Provide as much detail as you can so that
                we can better assist you.
            </Typography>
            <Formik enableReinitialize onSubmit={onSubmit}>
                {({ handleSubmit }) => {
                    return (
                        <Form>
                            {!userProfile?.id && (
                                <>
                                    <Field
                                        id={build(baseId, "name")}
                                        name="name"
                                        required={true}
                                        component={FormTextField}
                                        label="Name"
                                    />
                                    <Field
                                        id={build(baseId, "email")}
                                        name="email"
                                        required={false}
                                        component={FormTextField}
                                        label="E-mail"
                                        helperText="CyVerse may contact you about this feedback when you provide an email address."
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
                        </Form>
                    );
                }}
            </Formik>
        </DEDialog>
    );
}
