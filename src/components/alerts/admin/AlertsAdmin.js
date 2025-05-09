import React, { useState } from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import {
    Button,
    IconButton,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Skeleton,
    Stack,
} from "@mui/material";

import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import FormMultilineTextField from "components/forms/FormMultilineTextField";
import FormTimestampField from "components/forms/FormTimestampField";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";

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
import { formatDateObject } from "components/utils/DateFormatter";
import dateConstants from "components/utils/dateConstants";

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
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        <Field
                            component={FormMultilineTextField}
                            name="alertText"
                            label={t("alerts-admin:alertText")}
                            required={true}
                            sx={{ minWidth: "50ch", width: 0 }}
                        />
                        <Field
                            component={FormTimestampField}
                            name="startDate"
                            helperText={t("alerts-admin:startDate")}
                            required={false}
                            sx={{ minWidth: "25ch" }}
                        />
                        <Field
                            component={FormTimestampField}
                            name="endDate"
                            helperText={t("alerts-admin:endDate")}
                            required={true}
                            sx={{ minWidth: "25ch" }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                        >
                            {t("common:add")}
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

const AlertsEditor = (props) => {
    const [alertsList, setAlertsList] = useState([]);

    const queryClient = useQueryClient();

    const { t } = useTranslation(["alerts-admin", "common"]);

    function updateAlerts(queryresp) {
        setAlertsList(queryresp?.alerts || []);
    }

    const { isFetching: isFetchingList, error: loadingError } = useQuery({
        queryKey: ALL_ALERTS_QUERY_KEY,
        queryFn: allAlerts,
        enabled: true,
        onSuccess: updateAlerts,
    });

    const {
        mutate: addAlertMutation,
        error: addAlertError,
        isLoading: isAddingAlert,
    } = useMutation(addAlert, {
        onSuccess: (createdAlert) => {
            queryClient.invalidateQueries(ALL_ALERTS_QUERY_KEY);
            queryClient.invalidateQueries(ACTIVE_ALERTS_QUERY_KEY);
        },
    });

    const {
        mutate: removeAlertMutation,
        error: removeAlertError,
        isLoading: isRemovingAlert,
    } = useMutation(removeAlert, {
        onSuccess: (resp) => {
            queryClient.invalidateQueries(ALL_ALERTS_QUERY_KEY);
            queryClient.invalidateQueries(ACTIVE_ALERTS_QUERY_KEY);
        },
    });

    const isLoading = isQueryLoading([
        isFetchingList,
        isAddingAlert,
        isRemovingAlert,
    ]);

    const error = loadingError || addAlertError || removeAlertError;

    function formatAlert(formValues) {
        const { alertText, startDate, endDate } = formValues;
        const alertSpec = {
            "alert-text": alertText,
            "end-date": endDate
                ? formatDateObject(new Date(endDate), dateConstants.ISO_8601)
                : undefined,
            "start-date": startDate
                ? formatDateObject(new Date(startDate), dateConstants.ISO_8601)
                : undefined,
        };
        return alertSpec;
    }

    function handleSubmit(formValues) {
        addAlertMutation(formatAlert(formValues));
    }

    return isLoading ? (
        <Skeleton
            variant="rectangular"
            animation="wave"
            height={300}
            width="100%"
        />
    ) : error ? (
        <WrappedErrorHandler errorObject={error} />
    ) : (
        <Paper>
            <AddAlertForm t={t} handleSubmit={handleSubmit} />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("alerts-admin:alertText")}</TableCell>
                            <TableCell>{t("alerts-admin:startDate")}</TableCell>
                            <TableCell>{t("alerts-admin:endDate")}</TableCell>
                            <TableCell>{t("common:delete")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alertsList.map((alertData, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{alertData["alert"]}</TableCell>
                                    <TableCell>
                                        {alertData["start_date"] ||
                                            t("alerts-admin:none")}
                                    </TableCell>
                                    <TableCell>
                                        {alertData["end_date"]}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();

                                                removeAlertMutation({
                                                    "end-date":
                                                        alertData["end_date"],
                                                    "alert-text":
                                                        alertData["alert"],
                                                });
                                            }}
                                            size="large"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AlertsEditor;
