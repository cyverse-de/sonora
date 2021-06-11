/**
 *
 * @author sriram
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation, queryCache } from "react-query";
import { Field, Form, Formik } from "formik";

import constants from "../../constants";
import ids from "./ids";
import DEDialog from "components/utils/DEDialog";
import RequestStatus from "components/models/RequestStatus";
import RequestHistoryTable from "components/utils/RequestHistoryTable";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import { nonEmptyField } from "components/utils/validations";
import {
    adminGetRequestDetails,
    adminUpdateRequestStatus,
    REQUEST_DETAILS_QUERY_KEY,
    DOI_LISTING_QUERY_KEY,
} from "serviceFacades/doi";

import {
    announce,
    build,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";
import {
    CircularProgress,
    MenuItem,
    Button,
    Typography,
    Divider,
    useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default function UpdateRequestDialog(props) {
    const { open, onClose, requestId } = props;
    const [requestDetails, setRequestDetails] = useState();
    const [updateRequestError, setUpdateRequestError] = useState();
    const theme = useTheme();
    const { t } = useTranslation("doi");
    const { t: i18nUtil } = useTranslation("util");
    const baseId = ids.UPDATE_REQUEST_DIALOG;
    const { isFetching: isRequestFetching, error: requestFetchError } =
        useQuery({
            queryKey: [REQUEST_DETAILS_QUERY_KEY, { id: requestId }],
            queryFn: adminGetRequestDetails,
            config: {
                enabled: requestId && open,
                onSuccess: (data) => {
                    setRequestDetails(data);
                },
            },
        });
    const [updateRequest, { status: updateRequestStatus }] = useMutation(
        adminUpdateRequestStatus,
        {
            onSuccess: (data) => {
                announce({
                    text: t("requestUpdateSuccess"),
                });
                queryCache.invalidateQueries(DOI_LISTING_QUERY_KEY);
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
        if (!isRequestFetching && updateRequestStatus !== constants.LOADING) {
            updateRequest(submission);
        }
    };

    return (
        <Formik
            initialValues={{
                email: requestDetails?.requested_by?.email,
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
                                        id={build(baseId, ids.CANCEL_BTN)}
                                        aria-label={t("cancel")}
                                        onClick={onClose}
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        id={build(baseId, ids.SUBMIT_BTN)}
                                        aria-label={t("updateRequest")}
                                        onClick={handleSubmit}
                                    >
                                        {t("updateRequest")}
                                    </Button>
                                </>
                            }
                        >
                            {requestFetchError && (
                                <ErrorTypographyWithDialog
                                    errorObject={requestFetchError}
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
                            {isRequestFetching && (
                                <Skeleton
                                    animation="wave"
                                    variant="rect"
                                    height={500}
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

                            {!isRequestFetching && (
                                <>
                                    <Field
                                        name="email"
                                        label={t("email")}
                                        required={false}
                                        margin="dense"
                                        id={build(baseId, ids.EMAIL)}
                                        component={FormTextField}
                                    />

                                    <Field
                                        id={build(baseId, ids.STATUS)}
                                        name="status"
                                        label={t("status")}
                                        required
                                        validate={(value) =>
                                            nonEmptyField(value, i18nUtil)
                                        }
                                        component={FormTextField}
                                        select={true}
                                        variant="outlined"
                                        size="small"
                                    >
                                        {Object.values(RequestStatus).map(
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
                                        id={build(baseId, ids.COMMENTS)}
                                        component={FormMultilineTextField}
                                    />
                                    <Divider
                                        style={{
                                            marginTop: theme.spacing(1),
                                            marginBottom: theme.spacing(1),
                                        }}
                                    />
                                    <Typography variant="subtitle2">
                                        History
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
