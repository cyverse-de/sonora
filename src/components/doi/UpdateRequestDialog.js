/**
 *
 * @author sriram
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery } from "react-query";
import { Field, Form, Formik } from "formik";
import DEDialog from "components/utils/DEDialog";
import RequestStatus from "components/models/RequestStatus";
import RequestHistoryTable from "components/utils/RequestHistoryTable";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import {
    adminGetRequestDetails,
    REQUEST_DETAILS_QUERY_KEY,
} from "serviceFacades/doi";
import ids from "./ids";
import {
    build,
    FormSelectField,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";
import { MenuItem, Button, Typography, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default function UpdateRequestDialog(props) {
    const { open, onClose, request } = props;
    const [requestDetails, setRequestDetails] = useState();
    const { t } = useTranslation("doi");
    const baseId = ids.UPDATE_REQUEST_DIALOG;
    const {
        isFetching: isRequestFetching,
        error: requestFetchError,
    } = useQuery({
        queryKey: [REQUEST_DETAILS_QUERY_KEY, { id: request }],
        queryFn: adminGetRequestDetails,
        config: {
            enabled: request && open,
            onSuccess: (data) => {
                console.log(JSON.stringify(data));
                setRequestDetails(data);
            },
        },
    });
    const handleSubmit = (values, { props }) => {
        console.log(JSON.stringify(values));
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
                                        id={build(baseId, ids.CANCEL)}
                                        aria-label={t("cancel")}
                                        onClick={onClose}
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        id={build(baseId, ids.SUBMIT)}
                                        aria-label={t("submit")}
                                        onClick={handleSubmit}
                                    >
                                        {t("submit")}
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
                            {isRequestFetching && (
                                <Skeleton
                                    animation="wave"
                                    variant="rect"
                                    height={500}
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

                                    <Field name="status">
                                        {({
                                            field: { onChange, ...field },
                                            ...props
                                        }) => (
                                            <FormSelectField
                                                {...props}
                                                label={t("status")}
                                                required
                                                field={field}
                                                onChange={(event) => {
                                                    onChange(event);
                                                }}
                                                id="selectStatus"
                                                size="small"
                                            >
                                                {Object.values(
                                                    RequestStatus
                                                ).map((status, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={status}
                                                        id={baseId}
                                                        style={{
                                                            marginLeft: 1,
                                                        }}
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </FormSelectField>
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
                                            marginTop: 16,
                                            marginBottom: 16,
                                        }}
                                    />
                                    <Typography variant="subtitle2">
                                        History
                                    </Typography>
                                    <RequestHistoryTable
                                        history={requestDetails?.history}
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
