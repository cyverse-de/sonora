import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { Skeleton } from "@mui/material";

import { useTranslation } from "i18n";
import { useFormik } from "formik";

import {
    allAlerts,
    ALL_ALERTS_QUERY_KEY,
    ACTIVE_ALERTS_QUERY_KEY,
    addAlert,
    removeAlert,
} from "serviceFacades/notifications";

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
