/**
 * @author sriram
 *
 * A dialog that allows users to submit feedback
 *
 */
import React from "react";

import { Field, Form, Formik } from "formik";

import { build, FormMultilineTextField } from "@cyverse-de/ui-lib";
import DEDialog from "components/utils/DEDialog";
import { Button, CircularProgress, InputAdornment } from "@material-ui/core";

export default function Feedback(props) {
    const { open, baseId, title, onClose } = props;
    const { isLoading } = false;
    const onSubmit = (values) => {
        console.log("submit feedback now" + values);
    };
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
            <Formik enableReinitialize onSubmit={onSubmit}>
                {({ handleSubmit }) => {
                    return (
                        <Form>
                            <Field
                                id={build(baseId, "feedback")}
                                name="feedback"
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
