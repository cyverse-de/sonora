import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Field, Form, Formik } from "formik";
import { mapPropsToValues, formatSubscriptions } from "./formatters";
import DEDialog from "components/utils/DEDialog";
import { Button, MenuItem } from "@material-ui/core";
import FormTextField from "components/forms/FormTextField";
import FormSelectField from "components/forms/FormSelectField";
import styles from "../styles";
import {
    postSubscription,
    getPlanTypes,
    PLAN_TYPES_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import ids from "../ids";
import { nonEmptyField } from "components/utils/validations";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import SubscriptionErrorTypographyWithDialog from "../error/SubscriptionErrorTypographyWithDialog";
import buildID from "components/utils/DebugIDUtil";

function EditSubscriptionDialog(props) {
    const { open, onClose, parentId, subscription } = props;
    const [planTypes, setPlanTypes] = useState([]);
    const [subscriptionSubmission, setSubscriptionSubmission] = useState(null);
    const [failureReason, setFailureReason] = useState(null);
    const [mutateSubscriptionError, setMutateSubscriptionError] =
        useState(null);
    const { t } = useTranslation("subscriptions");

    const preProcessPlanTypes = React.useCallback(
        (data) => {
            if (data?.result?.length > 0) {
                setPlanTypes(data.result.map((type) => type.name));
            }
        },
        [setPlanTypes]
    );

    const { mutate: mutateSubscription } = useMutation(
        () => postSubscription(subscriptionSubmission),
        {
            onSuccess: (data) => {
                const dataResult = data?.result[0];
                const isFailed = dataResult?.failure_reason;
                isFailed ? setFailureReason(isFailed) : setFailureReason(null);
                setMutateSubscriptionError(isFailed ? dataResult : null);
                if (!isFailed) {
                    announce({
                        text: "Success",
                    });
                    onClose();
                }
            },
            onError: (err) => {
                setMutateSubscriptionError(err);
                console.log(err);
            },
        }
    );

    const handleSubmit = (values) => {
        setSubscriptionSubmission(formatSubscriptions(values));
        mutateSubscription();
    };

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setMutateSubscriptionError(null);
        setFailureReason(null);
        setSubscriptionSubmission(null);
    };

    useQuery({
        queryKey: [PLAN_TYPES_QUERY_KEY],
        queryFn: () => getPlanTypes(),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: preProcessPlanTypes,
    });

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
                                title={
                                    subscription
                                        ? t("editSubscription")
                                        : t("addSubscription")
                                }
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
                                {mutateSubscriptionError && !failureReason && (
                                    <ErrorTypographyWithDialog
                                        errorObject={mutateSubscriptionError}
                                        errorMessage={t(
                                            "mutateSubscriptionError"
                                        )}
                                        baseId={parentId}
                                    />
                                )}
                                {mutateSubscriptionError && failureReason && (
                                    <SubscriptionErrorTypographyWithDialog
                                        errorObject={mutateSubscriptionError}
                                        errorMessage={t(
                                            "mutateSubscriptionError"
                                        )}
                                        baseId={parentId}
                                    />
                                )}
                                <StyledEditSubscriptionForm
                                    parentId={parentId}
                                    planTypes={planTypes}
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

const StyledEditSubscriptionForm = withStyles(styles)(EditSubscriptionForm);

function EditSubscriptionForm(props) {
    const { parentId, planTypes, subscription } = props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");

    return (
        <>
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.EDIT_SUBSCRIPTION_FORM.USERNAME)}
                label={t("username")}
                name="username"
                disabled={subscription ? true : false}
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />

            <Field name="plan_name">
                {({ field: { onChange, ...field }, ...props }) => (
                    <FormSelectField
                        {...props}
                        id={buildID(
                            parentId,
                            ids.EDIT_SUBSCRIPTION_FORM.PLAN_NAME
                        )}
                        field={field}
                        label={t("planName")}
                        onChange={(event) => {
                            onChange(event);
                        }}
                        required
                    >
                        {planTypes.map((type, index) => (
                            <MenuItem
                                id={buildID(
                                    parentId,
                                    ids.EDIT_SUBSCRIPTION_FORM.PLAN_TYPES
                                )}
                                key={index}
                                value={type}
                            >
                                {type}
                            </MenuItem>
                        ))}
                    </FormSelectField>
                )}
            </Field>
        </>
    );
}

export default EditSubscriptionDialog;
