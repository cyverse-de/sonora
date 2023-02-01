import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Field, FieldArray, Form, Formik } from "formik";
import { mapPropsToValues, formatQuotas } from "./formatters";
import DEDialog from "components/utils/DEDialog";
import { Button } from "@material-ui/core";
import FormTextField from "components/forms/FormTextField";
import styles from "../styles";
import {
    updateUserQuota,
    SUBSCRIPTIONS_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import ids from "../ids";
import { nonEmptyField } from "components/utils/validations";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import buildID from "components/utils/DebugIDUtil";

import Usages from "./Usages";
import Quotas from "./Quotas";

function EditQuotasDialog(props) {
    const { open, onClose, parentId, subscription } = props;
    const [quotasSubmission, setQuotasSubmission] = useState(null);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [updateQuotasError, setUpdateQuotasError] = useState(null);
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();

    const { mutate: updateQuotas } = useMutation(
        () =>
            updateUserQuota(
                quotasSubmission,
                selectedResourceType,
                selectedUsername
            ),
        {
            onSuccess: (data) => {
                announce({
                    text: t("quotaUpdated"),
                });
                queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY);
                setUpdateQuotasError(null);
                onClose();
            },
            onError: setUpdateQuotasError,
        }
    );

    const handleSubmit = (values) => {
        const { quota, resource_type, username } = values;
        setQuotasSubmission(formatQuotas(quota));
        setSelectedResourceType(resource_type);
        setSelectedUsername(username);
        updateQuotas();
    };

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setUpdateQuotasError(null);
        setQuotasSubmission(null);
    };

    return (
        <>
            <Formik
                initialValues={mapPropsToValues(subscription)}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ handleSubmit, ...props }) => {
                    return (
                        <Form>
                            <DEDialog
                                {...props}
                                id={parentId}
                                open={open}
                                onClose={() => {
                                    onCloseForm();
                                    props.resetForm();
                                }}
                                fullWidth={true}
                                title={t("editQuotas")}
                                actions={
                                    <>
                                        <Button
                                            {...props}
                                            id={buildID(
                                                parentId,
                                                ids.CANCEL_BUTTON
                                            )}
                                            onClick={() => {
                                                onCloseForm();
                                                props.resetForm();
                                            }}
                                        >
                                            {t("cancel")}
                                        </Button>

                                        <Button
                                            id={buildID(
                                                parentId,
                                                ids.SAVE_BUTTON
                                            )}
                                            type="submit"
                                            color="primary"
                                            onClick={handleSubmit}
                                        >
                                            {t("submit")}
                                        </Button>
                                    </>
                                }
                            >
                                {updateQuotasError && (
                                    <ErrorTypographyWithDialog
                                        errorObject={updateQuotasError}
                                        errorMessage={t("updateQuotasError")}
                                        baseId={parentId}
                                    />
                                )}

                                <StyledEditQuotasForm
                                    parentId={parentId}
                                    subscription={subscription}
                                />
                            </DEDialog>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
}

const StyledEditQuotasForm = withStyles(styles)(EditQuotasForm);

function EditQuotasForm(props) {
    const { parentId, subscription } = props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");

    return (
        <>
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.EDIT_QUOTAS_DLG.USERNAME)}
                label={t("username")}
                name="username"
                disabled
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />

            <Field
                component={FormTextField}
                id={buildID(parentId, ids.EDIT_QUOTAS_DLG.PLAN_NAME)}
                label={t("planName")}
                name="plan_name"
                disabled
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />

            {subscription && (
                <Quotas
                    parentId={buildID(parentId, ids.EDIT_QUOTAS_DLG.QUOTAS)}
                    subscription={subscription}
                />
            )}

            {/* {subscription && (
                <FieldArray
                    name = {"quotas"}
                    render={(arrayHelpers) => (
                        <Quotas 
                            parentId={buildID(
                                parentId,
                                ids.EDIT_QUOTAS_DLG.QUOTAS
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )} */}

            {subscription && (
                <FieldArray
                    name={"usages"}
                    render={(arrayHelpers) => (
                        <Usages
                            parentId={buildID(
                                parentId,
                                ids.EDIT_SUB_DLG.USAGES
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
        </>
    );
}

export default EditQuotasDialog;
