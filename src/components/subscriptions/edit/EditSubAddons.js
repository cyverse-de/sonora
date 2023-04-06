import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import {
    formatUpdatedAddonSubmission,
    mapSubAddonsPropsToValues,
} from "./formatters";
import ids from "../ids";

import { useTranslation } from "i18n";
import { FieldArray, Field, Form, Formik } from "formik";
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Remove } from "@material-ui/icons";

import DEDialog from "components/utils/DEDialog";
import buildID from "components/utils/DebugIDUtil";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import EmptyTable from "components/table/EmptyTable";
import FormNumberField from "components/forms/FormNumberField";
import FormCheckbox from "components/forms/FormCheckbox";
import TableLoading from "components/table/TableLoading";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import {
    putSubAddon,
    SUBSCRIPTION_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { nonZeroValue } from "components/utils/validations";

const TABLE_COLUMNS = [
    { name: "", numeric: false, enableSorting: false },
    { name: "Name", numeric: false, enableSorting: false },
    { name: "Resource Type", numeric: false, enableSorting: false },
    { name: "Amount", numeric: false, enableSorting: false },
    { name: "Paid", numeric: false, enableSorting: false },
];

function LoadingMask(props) {
    const { columns, tableId } = props;
    return (
        <TableLoading
            numColumns={columns.length + 1}
            numRows={5}
            baseId={tableId}
        />
    );
}

function EditSubAddonsDialog(props) {
    const {
        isFetchingSubAddons,
        onAddAddonsSelected,
        onClose,
        open,
        parentId,
        selectedSubscriptionAddons,
        subscriptionId,
    } = props;
    const { t } = useTranslation("subscriptions");
    const queryClient = useQueryClient();
    const [subAddonUpdateError, setSubAddonUpdateError] = useState(null);

    const { mutate: updateSubAddon } = useMutation(
        (submission) => putSubAddon(subscriptionId, submission),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(SUBSCRIPTION_ADDONS_QUERY_KEY);
                announce({ text: t("subAddonsUpdated") });
                onClose();
            },
            onError: { setSubAddonUpdateError },
        }
    );

    const handleSubmit = (values) => {
        updateSubAddon(formatUpdatedAddonSubmission(values));
    };

    const resetState = () => {
        setSubAddonUpdateError(null);
    };

    return (
        <Formik
            initialValues={mapSubAddonsPropsToValues(
                selectedSubscriptionAddons
            )}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit, resetForm }) => (
                <Form>
                    <DEDialog
                        id={parentId}
                        open={open}
                        onClose={() => {
                            onClose();
                            resetForm();
                            resetState();
                        }}
                        fullWidth={true}
                        title={t("editAddons")}
                        actions={
                            <>
                                <Button
                                    id={buildID(parentId, ids.CANCEL_BUTTON)}
                                    variant="outlined"
                                    onClick={() => {
                                        onClose();
                                        resetForm();
                                        resetState();
                                    }}
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    id={buildID(parentId, ids.SUBMIT_BUTTON)}
                                    variant="outlined"
                                    type="submit"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    {t("submit")}
                                </Button>
                            </>
                        }
                    >
                        <Button
                            id={buildID(parentId, ids.ADD_BUTTON)}
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onAddAddonsSelected}
                        >
                            {t("add")}
                        </Button>
                        {subAddonUpdateError && (
                            <ErrorTypographyWithDialog
                                errorObject={subAddonUpdateError}
                                errorMessage={t("updateSubAddonError")}
                                baseId={parentId}
                            />
                        )}
                        <EditSubAddonsForm
                            addons={selectedSubscriptionAddons}
                            handleSubmit={handleSubmit}
                            onAddAddonsSelected={onAddAddonsSelected}
                            isFetchingSubAddons={isFetchingSubAddons}
                            resetForm={resetForm}
                            parentId={parentId}
                        />
                    </DEDialog>
                </Form>
            )}
        </Formik>
    );
}

function EditSubAddonsForm(props) {
    const {
        addons,
        handleSubmit,
        isFetchingSubAddons,
        onAddAddonsSelected,
        parentId,
        resetForm,
    } = props;

    const { t } = useTranslation("subscriptions");

    return (
        <>
            <Table>
                <DETableHead
                    baseId={parentId}
                    columnData={TABLE_COLUMNS}
                    rowsInPage={addons ? addons.length : 0}
                    selectable={false}
                />
                {(!addons || addons.length === 0) && (
                    <EmptyTable
                        message={t("noAddons")}
                        numColumns={TABLE_COLUMNS.length}
                    />
                )}

                {addons && (
                    <FieldArray
                        name={"addons"}
                        render={(arrayHelpers) => (
                            <FormBody
                                parentId={buildID(
                                    parentId,
                                    ids.ADDONS.EDIT_SUB_ADDONS
                                )}
                                addons={addons}
                                handleSubmit={handleSubmit}
                                isFetchingSubAddons={isFetchingSubAddons}
                                onAddAddonsSelected={onAddAddonsSelected}
                                resetForm={resetForm}
                                {...arrayHelpers}
                            />
                        )}
                    />
                )}
            </Table>
        </>
    );
}

function FormBody(props) {
    const { addons, isFetchingSubAddons, name, parentId } = props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");
    const tableId = buildID(parentId, ids.SUB_ADDONS.EDIT_ADDONS_TABLE);
    return (
        <>
            {isFetchingSubAddons ? (
                <LoadingMask columns={TABLE_COLUMNS} tableId={tableId} />
            ) : (
                <TableBody>
                    {addons &&
                        addons.length > 0 &&
                        addons.map((item, index) => {
                            let resourceInBytes =
                                item.addon.resource_type.unit.toLowerCase() ===
                                "bytes";
                            let addonUUID = item.uuid;
                            return (
                                <DERow tabIndex={-1} key={addonUUID}>
                                    <TableCell>
                                        <IconButton
                                            aria-label={t(
                                                "removeAddonAriaLabel"
                                            )}
                                            size="small"
                                        >
                                            <Remove></Remove>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {item.addon.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {resourceInBytes
                                                ? "GiB"
                                                : item.addon.resource_type.unit}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name={`${name}.${index}.amount`}
                                            component={FormNumberField}
                                            disabled={false}
                                            fullWidth={false}
                                            id={ids.SUB_ADDONS.NAME_FIELD}
                                            required
                                            validate={(value) =>
                                                nonZeroValue(value, i18nUtil)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name={`${name}.${index}.paid`}
                                            component={FormCheckbox}
                                            disabled={false}
                                            id={ids.SUB_ADDONS.PAID_FIELD}
                                        />
                                    </TableCell>
                                </DERow>
                            );
                        })}
                </TableBody>
            )}
        </>
    );
}

export default EditSubAddonsDialog;
