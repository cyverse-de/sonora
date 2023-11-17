/**
 *
 * @author sriram
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Field, Form, Formik } from "formik";

import constants from "../../constants";
import ids from "../doi/ids";
import DEDialog from "components/utils/DEDialog";
import DOIRequestStatus from "components/models/DOIRequestStatus";
import ToolRequestStatus from "components/models/ToolRequestStatus";
import RequestType from "components/models/RequestType";
import RequestHistoryTable from "components/utils/RequestHistoryTable";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { nonEmptyField } from "components/utils/validations";
import {
    adminGetRequestDetails,
    adminUpdateDOIRequestStatus,
    REQUEST_DETAILS_QUERY_KEY,
    DOI_LISTING_QUERY_KEY,
} from "serviceFacades/doi";
import {
    ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY,
    getAdminToolRequestDetails,
    adminUpdateToolRequest,
} from "serviceFacades/tools";
import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import FormTextField from "components/forms/FormTextField";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import {
    CircularProgress,
    MenuItem,
    Button,
    Typography,
    Divider,
    useTheme,
} from "@mui/material";
import { Skeleton } from "@mui/material";

export default function UpdateRequestDialog(props) {
    const { open, onClose, requestId, requestType } = props;
    const [requestDetails, setRequestDetails] = useState();
    const [updateRequestError, setUpdateRequestError] = useState();
    const [toolRequestFetchError, setToolRequestFetchError] = useState();
    const [doiRequestFetchError, setDoiRequestFetchError] = useState();
    const theme = useTheme();
    const { t } = useTranslation("util");
    const baseId = ids.UPDATE_REQUEST_DIALOG;

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { isFetching: isDOIRequestFetching } = useQuery({
        queryKey: [REQUEST_DETAILS_QUERY_KEY, { id: requestId }],
        queryFn: () => adminGetRequestDetails({ id: requestId }),
        enabled: !!requestId && open && requestType === RequestType.DOI,
        onError: setDoiRequestFetchError,
        onSuccess: (data) => {
            setUpdateRequestError(null);
            setRequestDetails(data);
            setDoiRequestFetchError(null);
            setToolRequestFetchError(null);
        },
    });

    const { isFetching: isToolRequestFetching } = useQuery({
        queryKey: [ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY, { id: requestId }],
        queryFn: () => getAdminToolRequestDetails({ id: requestId }),
        enabled: !!requestId && open && requestType === RequestType.TOOL,
        onError: setToolRequestFetchError,
        onSuccess: (resp) => {
            setUpdateRequestError(null);
            setRequestDetails(resp);
            setDoiRequestFetchError(null);
            setToolRequestFetchError(null);
        },
    });

    const { mutate: updateRequest, status: updateRequestStatus } = useMutation(
        requestType === RequestType.TOOL
            ? adminUpdateToolRequest
            : adminUpdateDOIRequestStatus,
        {
            onSuccess: (data) => {
                announce({
                    text: t("requestUpdateSuccess"),
                });
                queryClient.invalidateQueries(DOI_LISTING_QUERY_KEY);
                setUpdateRequestError(null);
                onClose();
            },
            onError: setUpdateRequestError,
        }
    );
    const handleSubmit = (values, { props }) => {
        const submission = {
            id: requestId,
            comments: values.comments,
            status: values.status,
        };
        if (
            !isDOIRequestFetching &&
            updateRequestStatus !== constants.LOADING &&
            !isToolRequestFetching
        ) {
            updateRequest(submission);
        }
    };

    let statuses =
        requestType === RequestType.TOOL ? ToolRequestStatus : DOIRequestStatus;

    return (
        <Formik
            initialValues={{
                email:
                    requestType === RequestType.DOI
                        ? requestDetails?.requested_by?.email
                        : requestDetails?.submitted_by,
                status: "",
                comments: "",
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={t("updateRequest")}
                            actions={
                                <>
                                    <Button
                                        type="cancel"
                                        id={buildID(baseId, ids.CANCEL_BTN)}
                                        aria-label={t("cancel")}
                                        onClick={onClose}
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        id={buildID(baseId, ids.SUBMIT_BTN)}
                                        aria-label={t("updateRequest")}
                                        onClick={handleSubmit}
                                    >
                                        {t("updateRequest")}
                                    </Button>
                                </>
                            }
                        >
                            {doiRequestFetchError && (
                                <ErrorTypographyWithDialog
                                    errorObject={doiRequestFetchError}
                                    errorMessage={t("requestFetchError")}
                                    baseId={baseId}
                                />
                            )}
                            {toolRequestFetchError && (
                                <ErrorTypographyWithDialog
                                    errorObject={toolRequestFetchError}
                                    errorMessage={t("requestFetchError")}
                                    baseId={baseId}
                                />
                            )}
                            {updateRequestError && (
                                <ErrorTypographyWithDialog
                                    errorObject={updateRequestError}
                                    errorMessage={t("requestUpdateFailure")}
                                    baseId={baseId}
                                />
                            )}
                            {(isDOIRequestFetching ||
                                isToolRequestFetching) && (
                                <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    height={400}
                                />
                            )}
                            {updateRequestStatus === constants.LOADING && (
                                <CircularProgress
                                    size={30}
                                    thickness={5}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                    }}
                                />
                            )}

                            {!doiRequestFetchError &&
                                !toolRequestFetchError &&
                                !(
                                    isDOIRequestFetching ||
                                    isToolRequestFetching
                                ) && (
                                    <>
                                        <Field
                                            name="email"
                                            label={t("email")}
                                            required={false}
                                            margin="dense"
                                            id={buildID(baseId, ids.EMAIL)}
                                            component={FormTextField}
                                        />

                                        <Field
                                            id={buildID(baseId, ids.STATUS)}
                                            name="status"
                                            label={t("status")}
                                            required
                                            validate={(value) =>
                                                nonEmptyField(value, t)
                                            }
                                            component={FormTextField}
                                            select={true}
                                            variant="outlined"
                                            size="small"
                                        >
                                            {Object.values(statuses).map(
                                                (status, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={status}
                                                        id={baseId}
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Field>
                                        <Field
                                            name="comments"
                                            label={t("comments")}
                                            required={false}
                                            margin="dense"
                                            id={buildID(baseId, ids.COMMENTS)}
                                            component={FormMultilineTextField}
                                        />
                                        <Divider
                                            style={{
                                                marginTop: theme.spacing(1),
                                                marginBottom: theme.spacing(1),
                                            }}
                                        />
                                        <Typography variant="subtitle2">
                                            {t("history")}
                                        </Typography>
                                        <RequestHistoryTable
                                            history={requestDetails?.history}
                                            baseId={baseId}
                                            t={t}
                                        />
                                    </>
                                )}
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
