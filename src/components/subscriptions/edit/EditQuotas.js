import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { FieldArray, Form, Formik } from "formik";
import { mapPropsToValues, formatQuotas } from "./formatters";
import DEDialog from "components/utils/DEDialog";
import { Button, Grid, Typography } from "@mui/material";
import SimpleExpansionPanel from "components/utils/SimpleExpansionPanel";

import {
    updateUserQuotas,
    SUBSCRIPTIONS_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { useTranslation } from "i18n";

import ids from "../ids";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import buildID from "components/utils/DebugIDUtil";

import Usages from "./Usages";
import Quotas from "./Quotas";
import GridLabelValue from "components/utils/GridLabelValue";

function EditQuotasDialog(props) {
    const { open, onClose, parentId, subscription } = props;
    const [updateQuotasError, setUpdateQuotasError] = useState(null);
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();

    const { mutate: updateQuotas } = useMutation(
        ({ quotas, username }) => updateUserQuotas(quotas, username),
        {
            onSuccess: (_data) => {
                announce({
                    text: t("quotaUpdated"),
                });
                setUpdateQuotasError(null);
                onClose();
                queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY);
            },
            onError: setUpdateQuotasError,
        }
    );

    const handleSubmit = (values) => {
        updateQuotas(formatQuotas(values));
    };

    const onCloseForm = () => {
        onClose();
        resetState();
    };

    const resetState = () => {
        setUpdateQuotasError(null);
    };

    return (
        <Formik
            initialValues={mapPropsToValues(subscription)}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            id={parentId}
                            open={open}
                            onClose={() => {
                                onCloseForm();
                            }}
                            fullWidth={true}
                            title={t("editQuotas")}
                            actions={
                                <>
                                    <Button
                                        id={buildID(
                                            parentId,
                                            ids.CANCEL_BUTTON
                                        )}
                                        onClick={() => {
                                            onCloseForm();
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
                            {updateQuotasError && (
                                <ErrorTypographyWithDialog
                                    errorObject={updateQuotasError}
                                    errorMessage={t("updateQuotasError")}
                                    baseId={parentId}
                                />
                            )}

                            <EditQuotasForm
                                parentId={parentId}
                                subscription={subscription}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

function EditQuotasForm(props) {
    const { parentId, subscription } = props;
    const { t } = useTranslation("subscriptions");
    return (
        <>
            <SimpleExpansionPanel
                parentId={parentId}
                header={t("details")}
                defaultExpanded={true}
            >
                <Grid container spacing={2}>
                    <GridLabelValue label={t("username")}>
                        <Typography>{subscription?.user?.username}</Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("planName")}>
                        <Typography>{subscription?.plan?.name}</Typography>
                    </GridLabelValue>
                </Grid>
            </SimpleExpansionPanel>

            {subscription && (
                <FieldArray
                    name={"quotas"}
                    render={(arrayHelpers) => (
                        <Quotas
                            parentId={buildID(
                                parentId,
                                ids.EDIT_QUOTAS_DLG.QUOTAS
                            )}
                            subscription={subscription}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}

            {subscription && (
                <Usages
                    parentId={buildID(parentId, ids.EDIT_SUB_DLG.USAGES)}
                    usages={subscription.usages}
                />
            )}
        </>
    );
}

export default EditQuotasDialog;
