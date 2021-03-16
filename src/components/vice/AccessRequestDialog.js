/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";
import ids from "./ids";
import { build, announce, FormMultilineTextField } from "@cyverse-de/ui-lib";
import { Field, Form, Formik } from "formik";

import requestAccess from "serviceFacades/vice/accessRequest";
import constants from "../../constants";

import DEDialog from "components/utils/DEDialog";
import { useConfig } from "contexts/config";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

export default function AccessRequestDialog(props) {
    const { open, baseId, onClose } = props;
    const [error, setError] = React.useState();
    const [config] = useConfig();
    const { t } = useTranslation("vice");
    const { t: i18nCommon } = useTranslation("common");

    const [submitRequest, { status }] = useMutation(requestAccess, {
        onSuccess: (data) => {
            announce({
                text: t("requestSubmitted"),
            });
            onClose();
        },
        onError: setError,
    });

    const handleSubmit = ({ intended_use }) => {
        const submission = {
            intended_use,
            concurrent_jobs: config?.vice.concurrentJobs,
        };
        submitRequest(submission);
    };
    const validate = (value) => {
        const minChars = parseInt(config?.vice.useCaseMinChars, 10);
        if (!value) {
            return t("emptyValue");
        }
        if (value.length < minChars) {
            return t("minLengthUseCaseError", {
                minLength: minChars,
            });
        }
    };
    return (
        <Formik
            onSubmit={handleSubmit}
            enableReinitialize={true}
            initialValues={{
                intended_use: "",
            }}
        >
            {({ handleSubmit, values }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={t("accessRequestTitle")}
                            actions={
                                <>
                                    <Button
                                        id={build(
                                            baseId,
                                            ids.ACCESS_REQUEST_DLG.CANCEL
                                        )}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(
                                            baseId,
                                            ids.ACCESS_REQUEST_DLG.SUBMIT
                                        )}
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("submit")}
                                    </Button>
                                </>
                            }
                        >
                            <Typography style={{ margin: 8 }}>
                                {t("accessRequestPrompt")}
                            </Typography>
                            {error && (
                                <ErrorTypographyWithDialog
                                    baseId={baseId}
                                    errorObject={error}
                                    errorMessage={t("requestError")}
                                />
                            )}
                            {status === constants.LOADING && (
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
                            <Field
                                name="intended_use"
                                label={t("useCase")}
                                id={build(
                                    baseId,
                                    ids.ACCESS_REQUEST_DLG.USE_CASE
                                )}
                                required
                                component={FormMultilineTextField}
                                validate={validate}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
