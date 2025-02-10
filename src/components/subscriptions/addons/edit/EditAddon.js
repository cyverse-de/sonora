import React, { useState, useCallback, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTranslation } from "i18n";

import "crypto";

import buildID from "components/utils/DebugIDUtil";
import { Button, MenuItem } from "@mui/material";
import DEDialog from "components/utils/DEDialog";
import { FastField, Field, FieldArray, Form, Formik } from "formik";
import {
    FormCheckbox,
    FormNumberField,
    FormTextField,
} from "components/forms/FormField";
import { nonEmptyField, nonZeroValue } from "components/utils/validations";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import ids from "../../ids";
import { formatAddonSubmission, mapPropsToValues } from "./formatters";

import {
    getResourceTypes,
    postAddon,
    putAddon,
    AVAILABLE_ADDONS_QUERY_KEY,
    RESOURCE_TYPES_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";
import AddonRatesEditor from "./AddonRatesEditor";

function EditAddonDialog(props) {
    const { addon, open, onClose, parentId } = props;
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    const resourceTypesCache = queryClient.getQueryData(
        RESOURCE_TYPES_QUERY_KEY
    );

    const [resourceTypes, setResourceTypes] = useState();
    const [resourceTypesQueryEnabled, setResourceTypesQueryEnabled] =
        useState();
    const [subscriptionAddonError, setSubscriptionAddonError] = useState();

    const preProcessResourceTypes = useCallback(
        (data) => {
            if (data?.result?.length > 0) {
                let types = data.result;
                setResourceTypes([...types]);
            }
        },
        [setResourceTypes]
    );

    useEffect(() => {
        if (resourceTypesCache) {
            preProcessResourceTypes(resourceTypesCache);
        } else {
            setResourceTypesQueryEnabled(true);
        }
    }, [preProcessResourceTypes, resourceTypesCache]);

    useQuery({
        queryKey: [RESOURCE_TYPES_QUERY_KEY],
        queryFn: getResourceTypes,
        enabled: resourceTypesQueryEnabled,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: preProcessResourceTypes,
    });

    const { mutate: createAddon } = useMutation(
        (addonSubmission) => postAddon(addonSubmission),
        {
            onSuccess: () => {
                announce({
                    text: t("addonCreated"),
                });
                onClose();
                queryClient.invalidateQueries(AVAILABLE_ADDONS_QUERY_KEY);
            },
            onError: setSubscriptionAddonError,
        }
    );

    const { mutate: updateAddon } = useMutation(
        (addonSubmission) => putAddon(addonSubmission),
        {
            onSuccess: () => {
                announce({
                    text: t("addonUpdated"),
                });
                onClose();
                queryClient.invalidateQueries(AVAILABLE_ADDONS_QUERY_KEY);
            },
            onError: setSubscriptionAddonError,
        }
    );

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setSubscriptionAddonError(null);
    };

    const handleSubmit = (values) => {
        if (addon) {
            updateAddon(formatAddonSubmission(values, resourceTypes, true));
        } else {
            createAddon(formatAddonSubmission(values, resourceTypes));
        }
    };

    return (
        <Formik
            initialValues={mapPropsToValues(addon)}
            onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
            }}
            enableReinitialize={true}
        >
            {({ handleSubmit, resetForm, values }) => {
                return (
                    <Form>
                        <DEDialog
                            id={parentId}
                            fullWidth={true}
                            open={open}
                            onClose={() => {
                                onCloseForm();
                                resetForm();
                            }}
                            title={addon ? t("editAddon") : t("createAddons")}
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
                                        variant="outlined"
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {t("submit")}
                                    </Button>
                                </>
                            }
                        >
                            {subscriptionAddonError && (
                                <ErrorTypographyWithDialog
                                    errorObject={subscriptionAddonError}
                                    errorMessage={t("subscriptionAddonError")}
                                    baseId={parentId}
                                />
                            )}
                            <EditAddonForm
                                addon={values}
                                parentId={parentId}
                                resourceTypes={resourceTypes}
                                t={t}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

function EditAddonForm(props) {
    const { addon, parentId, resourceTypes, t } = props;
    const { t: i18nUtil } = useTranslation("util");
    return (
        <>
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.ADDONS_DLG.NAME)}
                label={t("name")}
                name="addonName"
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.ADDONS_DLG.DESCRIPTION)}
                label={t("description")}
                name="description"
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
            />
            <FastField
                name="resourceType"
                component={FormTextField}
                id={buildID(parentId, ids.ADDONS_DLG.RESOURCE_TYPE)}
                label={t("resourceType")}
                variant="outlined"
                select
            >
                {resourceTypes?.map((type, index) => {
                    return (
                        <MenuItem
                            id={buildID(parentId, ids.ADDONS_DLG.RESOURCE_UNIT)}
                            key={index}
                            value={type.unit}
                        >
                            {type.unit.toLowerCase() === "bytes"
                                ? t("gib")
                                : type.unit}
                        </MenuItem>
                    );
                })}
            </FastField>
            <Field
                component={FormNumberField}
                id={buildID(parentId, ids.ADDONS_DLG.DEFAULT_AMOUNT)}
                label={t("defaultAmount")}
                name="defaultAmount"
                validate={(value) => nonZeroValue(value, i18nUtil)}
                required
            />
            <Field
                component={FormCheckbox}
                id={buildID(parentId, ids.ADDONS_DLG.DEFAULT_PAID)}
                label={t("defaultPaid")}
                name="defaultPaid"
            />
            <FieldArray
                name="addonRates"
                render={(arrayHelpers) => {
                    const onAdd = () => {
                        arrayHelpers.push({
                            uuid: crypto.randomUUID(),
                            rate: 0,
                            effectiveDate: Date.now().toString(),
                        });
                    };

                    const onDelete = (index) => {
                        arrayHelpers.remove(index);
                    };

                    return (
                        <AddonRatesEditor
                            addonRates={addon?.addonRates}
                            baseId={buildID(
                                parentId,
                                ids.ADDONS_DLG.ADDON_RATES
                            )}
                            fieldName="addonRates"
                            onAdd={onAdd}
                            onDelete={onDelete}
                        />
                    );
                }}
            />
        </>
    );
}

export default EditAddonDialog;
