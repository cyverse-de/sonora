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

import isQueryLoading from "components/utils/isQueryLoading";

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
    const [alertsList, setAlertsList] = useState([]);

    function updateAlerts(queryresp) {
        setAlertsList(queryresp?.alerts || []);
    }

    const {
        isLoading: isLoadingList,
        error: loadingError,
        data,
    } = useQuery({
        queryKey: ALL_ALERTS_QUERY_KEY,
        queryFn: allAlerts,
        enabled: true,
        onSuccess: updateAlerts,
    });

    const {
        mutate: addAlertMutation,
        error: addAlertError,
        isFetching: isAddingAlert,
    } = useMutation(addAlert, {
        onSuccess: (createdAlert) => {},
    });

    const {
        mutate: removeAlertMutation,
        error: removeAlertError,
        isFetching: isRemovingAlert,
    } = useMutation(removeAlert, {
        onSuccess: (resp) => {},
    });

    const isLoading = isQueryLoading([
        isLoadingList,
        isAddingAlert,
        isRemovingAlert,
    ]);
    const error = loadingError || addAlertError || removeAlertError;

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
                <>{error}</>
            ) : (
                <>{alertsList}</>
            )}
        </div>
    );
};

export default AlertsEditor;
