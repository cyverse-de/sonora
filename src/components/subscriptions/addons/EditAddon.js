import React, { useState, useCallback, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { Button, MenuItem } from "@material-ui/core";
import DEDialog from "components/utils/DEDialog";
import { FastField, Field, Form, Formik } from "formik";
import FormCheckbox from "components/forms/FormCheckbox";
import FormNumberField from "components/forms/FormNumberField";
import FormTextField from "components/forms/FormTextField";
import { nonEmptyField, nonZeroValue } from "components/utils/validations";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import ids from "../ids";
import { formatAddonSubmission, mapPropsToValues } from "./formatters";

import {
    getResourceTypes,
    postAddon,
    AVAILABLE_ADDONS_QUERY_KEY,
    RESOURCE_TYPES_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";

function EditAddonDialog(props) {
    const { open, onClose, parentId } = props;
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    const resourceTypesCache = queryClient.getQueryData(
        RESOURCE_TYPES_QUERY_KEY
    );

    const [resourceTypes, setResourceTypes] = useState();
    const [resourceTypesQueryEnabled, setResourceTypesQueryEnabled] =
        useState();
    const [postAddonError, setPostAddonError] = useState();

    const preProcessResourceTypes = useCallback(
        (data) => {
            if (data?.result?.length > 0) {
                let types = [];
                data.result.forEach((type) => types.push(type));
                setResourceTypes(types);
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
            onError: setPostAddonError,
        }
    );

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setPostAddonError(null);
    };

    const handleSubmit = (values) => {
        createAddon(formatAddonSubmission(values));
    };

    return (
        <Formik
            initialValues={mapPropsToValues()}
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
                            fullWidth={true}
                            open={open}
                            onClose={() => {
                                onCloseForm();
                                resetForm();
                            }}
                            title={t("createAddons")}
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
                            {postAddonError && (
                                <ErrorTypographyWithDialog
                                    errorObject={postAddonError}
                                    errorMessage={t("postAddonError")}
                                    baseId={parentId}
                                />
                            )}
                            <EditAddonForm
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
    const { parentId, resourceTypes, t } = props;
    const { t: i18nUtil } = useTranslation("util");
    return (
        <>
            <Field
                component={FormTextField}
                id={buildID(parentId, ids.ADDONS_DLG.NAME)}
                label={t("name")}
                name="name"
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
                component={FormTextField}
                id={buildID(parentId, ids.ADDONS_DLG.RESOURCE_TYPE)}
                label={t("resourceType")}
                name="resourceType"
                select
            >
                {resourceTypes?.map((type, index) => (
                    <MenuItem
                        id={buildID(parentId, ids.ADDONS_DLG.RESOURCE_UNIT)}
                        key={index}
                        value={type}
                    >
                        {type.unit.toLowerCase() === "bytes"
                            ? t("gib")
                            : type.unit}
                    </MenuItem>
                ))}
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
        </>
    );
}

export default EditAddonDialog;
