import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import { Skeleton } from "@mui/material";

import FormTextField from "components/forms/FormTextField";

import { useTranslation } from "i18n";
import { Field, Form, Formik } from "formik";

import {
    allAlerts,
    ALL_ALERTS_QUERY_KEY,
    ACTIVE_ALERTS_QUERY_KEY,
    addAlert,
    removeAlert,
} from "serviceFacades/notifications";

const initialValues = {
    startDate: "",
    endDate: "",
    alertText: "",
};

const AddAlertForm = ({ t, handleSubmit }) => {
    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(props) => (
                <Form>
                    <Field
                        component={FormTextField}
                        name="alertText"
                        required={true}
                    />
                    <Field
                        component={FormTextField}
                        name="endDate"
                        required={true}
                    />
                    <Field
                        component={FormTextField}
                        name="startDate"
                        required={false}
                    />
                </Form>
            )}
        </Formik>
    );
};

const AlertsEditor = (props) => {
    const isLoading = true;
    const isError = false;

    return (
        <div>
            {isLoading ? (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={300}
                    width="100%"
                />
            ) : isError ? (
                <></>
            ) : (
                <></>
            )}
        </div>
    );
};

export default AlertsEditor;
