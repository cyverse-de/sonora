import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Field, FieldArray, Form, Formik } from "formik";
import { mapPropsToValues, formatSubscriptions } from "./formatters";

import DEDialog from "components/utils/DEDialog";
import { Button, MenuItem } from "@material-ui/core";
import FormTextField from "components/forms/FormTextField";
import FormSelectField from "components/forms/FormSelectField";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { nonEmptyField } from "components/utils/validations";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import SubscriptionErrorTypographyWithDialog from "../error/SubscriptionErrorTypographyWithDialog";
import buildID from "components/utils/DebugIDUtil";

import {
    postSubscription,
    getPlanTypes,
    PLAN_TYPES_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { useTranslation } from "react-i18next";
import ids from "../ids";
import Usages from "./Usages";
import { SUBSCRIPTIONS_QUERY_KEY } from "serviceFacades/subscriptions";

function EditSubscriptionDialog(props) {
    const { open, onClose, parentId, subscription } = props;
    const [planTypes, setPlanTypes] = useState([]);
    const [subscriptionSubmission, setSubscriptionSubmission] = useState(null);
    const [failureReason, setFailureReason] = useState(null);
    const [mutateSubscriptionError, setMutateSubscriptionError] =
        useState(null);
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();

    const preProcessPlanTypes = React.useCallback(
        (data) => {
            if (data?.result?.length > 0) {
                let types = [];
                data.result.forEach((type) => types.push(type.name));
                setPlanTypes(types);
            }
        },
        [setPlanTypes]
    );

    const { mutate: mutateSubscription } = useMutation(
        () => postSubscription(subscriptionSubmission),
        {
            onSuccess: (data) => {
                let dataResult = data?.result[0];
                let isFailed = dataResult?.failure_reason;
                isFailed ? setFailureReason(isFailed) : setFailureReason(null);
                setMutateSubscriptionError(isFailed ? dataResult : null);

                if (!isFailed) {
                    announce({
                        text: t("subscriptionUpdated"),
                    });
                    queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY);
                    onClose();
                }
            },
            onError: (err) => {
                setMutateSubscriptionError(err);
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
                                        id={buildID(parentId, ids.SAVE_BUTTON)}
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
                                    errorMessage={t("mutateSubscriptionError")}
                                    baseId={parentId}
                                />
                            )}
                            {mutateSubscriptionError && failureReason && (
                                <SubscriptionErrorTypographyWithDialog
                                    errorObject={mutateSubscriptionError}
                                    errorMessage={t("mutateSubscriptionError")}
                                    baseId={parentId}
                                />
                            )}
                            <EditSubscriptionForm
                                parentId={parentId}
                                planTypes={planTypes}
                                subscription={subscription}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

function EditSubscriptionForm(props) {
    const { parentId, planTypes, subscription } = props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");

    return (
        <>
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.EDIT_SUB_DLG.USERNAME)}
                label={t("username")}
                name="username"
                disabled={!!subscription}
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />

            <Field name="plan_name">
                {({ field: { onChange, ...field }, ...props }) => (
                    <FormSelectField
                        {...props}
                        id={buildID(parentId, ids.EDIT_SUB_DLG.PLAN_NAME)}
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
                                    ids.EDIT_SUB_DLG.PLAN_TYPES
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

export default EditSubscriptionDialog;
