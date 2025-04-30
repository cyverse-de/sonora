import React, { useState } from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import {
    IconButton,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Typography,
    Skeleton,
} from "@mui/material";

import { Delete as DeleteIcon } from "@mui/icons-material";

import FormTextField from "components/forms/FormTextField";
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

import { makeStyles } from "tss-react/mui";

const initialValues = {
    startDate: "",
    endDate: "",
    alertText: "",
};

const useStyles = makeStyles()((theme) => ({
    flexContainer: {
        marginTop: 0,
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(4),
        marginRight: theme.spacing(2),
        display: "flex",
        flexWrap: "wrap",

        "& .MuiTextField-root": {
            width: 0,
            margin: theme.spacing(1),
            minWidth: "25ch",
        },
    },
    flexItem: {
        marginTop: 0,
        marginBottom: 0,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
}));

const AddAlertForm = ({ t, handleSubmit }) => {
    const { classes } = useStyles();
    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(props) => (
                <Form className={classes.flexContainer}>
                    <Field
                        component={FormTextField}
                        name="alertText"
                        label="Alert Text"
                        required={true}
                        className={classes.flexItem}
                    />
                    <Field
                        component={FormTimestampField}
                        name="startDate"
                        helperText="Start Date"
                        required={false}
                        className={classes.flexItem}
                    />
                    <Field
                        component={FormTimestampField}
                        name="endDate"
                        helperText="End Date"
                        required={true}
                        className={classes.flexItem}
                    />
                </Form>
            )}
        </Formik>
    );
};

const AlertsEditor = (props) => {
    const [alertsList, setAlertsList] = useState([]);

    const queryClient = useQueryClient();

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
        onSuccess: (createdAlert) => {
            queryClient.invalidateQueries(ALL_ALERTS_QUERY_KEY);
        },
    });

    const {
        mutate: removeAlertMutation,
        error: removeAlertError,
        isFetching: isRemovingAlert,
    } = useMutation(removeAlert, {
        onSuccess: (resp) => {
            queryClient.invalidateQueries(ALL_ALERTS_QUERY_KEY);
        },
    });

    const isLoading = isQueryLoading([
        isLoadingList,
        isAddingAlert,
        isRemovingAlert,
    ]);
    const error = loadingError || addAlertError || removeAlertError;

    function formatAlert(formValues) {
        const { alertText, startDate, endDate } = values;
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

    return (
        <div>
            {isLoading ? (
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
                    <AddAlertForm handleSubmit={handleSubmit} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Text</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {alertsList.map((alertData, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {alertData["start_date"] ||
                                                    "None"}
                                            </TableCell>
                                            <TableCell>
                                                {alertData["end_date"]}
                                            </TableCell>
                                            <TableCell>
                                                {alertData["alert"]}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();

                                                        removeAlertMutation({
                                                            end_date:
                                                                alertData[
                                                                    "end_date"
                                                                ],
                                                            alert: alertData[
                                                                "alert"
                                                            ],
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
            )}
        </div>
    );
};

export default AlertsEditor;
