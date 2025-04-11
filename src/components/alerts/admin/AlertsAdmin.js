import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { Skeleton, TextField } from "@mui/material";

import { useTranslation } from "i18n";
import { useFormik } from "formik";

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
    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
    });

    // i18n
    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                variant="standard"
                name="alertText"
                label="Alert Text"
                value={formik.values.alertText}
                onChange={formik.handleChange}
                error={formik.touched.alertText && formik.errors.alertText}
                helperText={formik.touched.alertText && formik.errors.alertText}
            />

            <TextField
                variant="standard"
                name="endDate"
                label="End Date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                error={formik.touched.endDate && formik.errors.endDate}
                helperText={formik.touched.endDate && formik.errors.endDate}
            />

            <TextField
                variant="standard"
                name="startDate"
                label="Start Date (optional)"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                error={formik.touched.startDate && formik.errors.startDate}
                helperText={formik.touched.startDate && formik.errors.startDate}
            />
        </form>
    );
};

const AlertsEditor = ({ showErrorAnnouncer }) => {
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

export default withErrorAnnouncer(AlertsEditor);
