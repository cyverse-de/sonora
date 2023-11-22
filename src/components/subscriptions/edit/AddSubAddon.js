import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { Field, Form, Formik } from "formik";
import { Button, MenuItem, Typography } from "@mui/material";
import DEDialog from "components/utils/DEDialog";
import FormTextField from "components/forms/FormTextField";
import { announce } from "components/announcer/CyVerseAnnouncer";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import ids from "../ids";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import { formatSubAddonSubmission } from "./formatters";
import {
    postSubAddon,
    SUBSCRIPTION_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";

function AddSubAddonsDialog(props) {
    const { availableAddons, onClose, open, parentId, subscriptionId } = props;
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    const [addSubAddonError, setAddSubAddonError] = useState(null);
    const { mutate: addSubAddon } = useMutation(
        (addonSubmission) => postSubAddon(subscriptionId, addonSubmission),
        {
            onSuccess: () => {
                announce({ text: t("subscriptionUpdated") });
                onClose();
                queryClient.invalidateQueries(SUBSCRIPTION_ADDONS_QUERY_KEY);
            },
            onError: setAddSubAddonError,
        }
    );

    const handleSubmit = (values) => {
        addSubAddon(formatSubAddonSubmission(values));
    };

    const resetState = () => {
        setAddSubAddonError(null);
    };

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    return (
        <Formik
            initialValues={{ addon_uuid: "" }}
            onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
            }}
            enableReinitialize={true}
        >
            {({ handleSubmit, resetForm }) => (
                <Form>
                    <DEDialog
                        id={parentId}
                        open={open}
                        onClose={() => {
                            onCloseForm();
                            resetForm();
                        }}
                        fullWidth={true}
                        title={t("addAddon")}
                        actions={
                            <>
                                <Button
                                    id={buildID(parentId, ids.CANCEL_BUTTON)}
                                    onClick={() => {
                                        onCloseForm();
                                        resetForm();
                                    }}
                                    variant="outlined"
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    id={buildID(parentId, ids.SUBMIT_BUTTON)}
                                    type="submit"
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    {t("submit")}
                                </Button>
                            </>
                        }
                    >
                        <Typography>{t("chooseAddon")}</Typography>
                        <Field
                            name="addon_uuid"
                            component={FormTextField}
                            variant="outlined"
                            select
                            size="small"
                            id={ids.SUB_ADDONS.UUID_FIELD}
                            label={t("addonName")}
                        >
                            {availableAddons?.map((addon) => (
                                <MenuItem
                                    id={ids.SUB_ADDONS.AVAILABLE_ADDONS}
                                    key={addon.uuid}
                                    value={addon.uuid}
                                >
                                    {addon.name}
                                </MenuItem>
                            ))}
                        </Field>

                        {addSubAddonError && (
                            <ErrorTypographyWithDialog
                                errorObject={addSubAddonError}
                                errorMessage={t("mutateSubscriptionError")}
                                baseId={parentId}
                            />
                        )}
                    </DEDialog>
                </Form>
            )}
        </Formik>
    );
}

export default AddSubAddonsDialog;
