import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FastField, Field, Form, Formik } from "formik";
import { mapPropsToValues, formatSubscriptions } from "./formatters";

import DEDialog from "components/utils/DEDialog";
import { Button, MenuItem } from "@material-ui/core";

import FormCheckbox from "components/forms/FormCheckbox";
import FormTextField from "components/forms/FormTextField";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { nonEmptyField } from "components/utils/validations";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import SubscriptionErrorHandler from "../error/SubscriptionErrorHandler";

import buildID from "components/utils/DebugIDUtil";

import {
    postSubscription,
    getPlanTypes,
    PLAN_TYPES_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { useTranslation } from "i18n";
import ids from "../ids";
import Usages from "./Usages";
import { SUBSCRIPTIONS_QUERY_KEY } from "serviceFacades/subscriptions";

function EditSubscriptionDialog(props) {
    const { open, onClose, parentId, subscription } = props;
    const [planTypes, setPlanTypes] = useState([]);
    const [failureReason, setFailureReason] = useState(null);
    const [mutateSubscriptionError, setMutateSubscriptionError] =
        useState(null);
    const [planTypesQueryEnabled, setPlanTypesQueryEnabled] = useState();

    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    const planTypesCache = queryClient.getQueryData(PLAN_TYPES_QUERY_KEY);

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

    React.useEffect(() => {
        if (planTypesCache) {
            preProcessPlanTypes(planTypesCache);
        } else {
            setPlanTypesQueryEnabled(true);
        }
    }, [preProcessPlanTypes, planTypesCache]);

    const { mutate: mutateSubscription } = useMutation(
        (subscriptionSubmission) => postSubscription(subscriptionSubmission),
        {
            onSuccess: (data) => {
                // The individual subscription requests inside the request body are treated
                // separately. It’s always necessary to check the response body to see if the
                // requests failed.
                let dataResult = data?.result[0];
                let isFailed = dataResult?.failure_reason;

                if (!isFailed) {
                    announce({
                        text: t("subscriptionUpdated"),
                    });
                    onClose();
                    queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY);
                }

                setMutateSubscriptionError(isFailed ? dataResult : null);
                setFailureReason(isFailed);
            },
            onError: (err) => {
                setMutateSubscriptionError(err);
            },
        }
    );

    const handleSubmit = (values) => {
        mutateSubscription(formatSubscriptions(values));
    };

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setMutateSubscriptionError(null);
        setFailureReason(null);
    };

    useQuery({
        queryKey: [PLAN_TYPES_QUERY_KEY],
        queryFn: getPlanTypes,
        enabled: planTypesQueryEnabled,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: preProcessPlanTypes,
    });

    return (
        <Formik
            initialValues={mapPropsToValues(subscription)}
            onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
            }}
            enableReinitialize={true}
        >
            {({ handleSubmit, resetForm }) => {
                return (
                    <Form>
                        <DEDialog
                            id={parentId}
                            open={open}
                            onClose={() => {
                                onCloseForm();
                                resetForm();
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
                                        id={buildID(
                                            parentId,
                                            ids.CANCEL_BUTTON
                                        )}
                                        onClick={() => {
                                            onCloseForm();
                                            resetForm();
                                        }}
                                        variant="outlined"
                                    >
                                        {t("cancel")}
                                    </Button>

                                    <Button
                                        id={buildID(
                                            parentId,
                                            ids.SUBMIT_BUTTON
                                        )}
                                        type="submit"
                                        color="primary"
                                        variant="outlined"
                                        onClick={handleSubmit}
                                    >
                                        {t("submit")}
                                    </Button>
                                </>
                            }
                        >
                            {mutateSubscriptionError && (
                                <ErrorTypographyWithDialog
                                    errorHandler={
                                        failureReason
                                            ? SubscriptionErrorHandler
                                            : null
                                    }
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

    const selectProps = {
        id: buildID(parentId, ids.EDIT_SUB_DLG.PLAN_NAME),
        label: t("planName"),
    };
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

            <FastField
                name="plan_name"
                component={FormTextField}
                variant="outlined"
                select
                size="small"
                {...selectProps}
            >
                {planTypes.map((type, index) => (
                    <MenuItem
                        id={buildID(parentId, ids.EDIT_SUB_DLG.PLAN_TYPES)}
                        key={index}
                        value={type}
                    >
                        {type}
                    </MenuItem>
                ))}
            </FastField>

            <Field
                name="paid"
                label={t("paid")}
                id={buildID(parentId, ids.EDIT_SUB_DLG.PAID)}
                component={FormCheckbox}
            />

            {subscription && (
                <Usages
                    parentId={buildID(parentId, ids.EDIT_SUB_DLG.USAGES)}
                    usages={subscription.usages}
                />
            )}
        </>
    );
}

export default EditSubscriptionDialog;
