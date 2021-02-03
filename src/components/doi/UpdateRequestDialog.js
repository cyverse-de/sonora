/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation, queryCache } from "react-query";
import { Field, Form, Formik } from "formik";
import DEDialog from "components/utils/DEDialog";
import RequestStatus from "components/models/RequestStatus";
import ids from "./ids";
import {
    build,
    FormSelectField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";
import { MenuItem, Button } from "@material-ui/core";

export default function UpdateRequestDialog(props) {
    const { open, onClose, request } = props;
    const { t } = useTranslation("doi");
    const baseId = ids.UPDATE_REQUEST_DIALOG;
    const handleSubmit = (values, { props }) => {};
    return (
        <Formik
            initialValues={{
                email: "",
                status: "",
                updatedStatus: "",
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
                                        variant="outlined"
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
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
