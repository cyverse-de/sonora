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
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AddIcon from "@mui/icons-material/Add";
import { Remove } from "@mui/icons-material";

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
    { name: "Amount", numeric: true, enableSorting: false },
    { name: "Type", numeric: false, enableSorting: false },
    { name: "Paid", numeric: false, enableSorting: false },
];

const useStyles = makeStyles(() => ({
    tableCell: {
        padding: "0px 16px 0px 16px",
    },
    table: {
        margin: "10px 0px 10px 0px",
    },
    alignRight: {
        textAlign: "right",
    },
}));

function LoadingMask(props) {
    const { columns, tableId } = props;
    return (
        <TableLoading
            numColumns={columns.length + 1}
            numRows={2}
            baseId={tableId}
        />
    );
}

function EditSubAddonsDialog(props) {
    const {
        handleRemoveAddon,
        isFetchingSubAddons,
        onAddonsSelected,
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
            onError: setSubAddonUpdateError,
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
            {({ dirty, handleSubmit, resetForm }) => (
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
                                {selectedSubscriptionAddons &&
                                    selectedSubscriptionAddons.length > 0 && (
                                        <>
                                            <Button
                                                id={buildID(
                                                    parentId,
                                                    ids.CANCEL_BUTTON
                                                )}
                                                variant="outlined"
                                                onClick={() => {
                                                    onClose();
                                                    resetForm();
                                                    resetState();
                                                }}
                                            >
                                                {dirty
                                                    ? t("cancel")
                                                    : t("close")}
                                            </Button>

                                            {dirty && (
                                                <Button
                                                    id={buildID(
                                                        parentId,
                                                        ids.SUBMIT_BUTTON
                                                    )}
                                                    variant="outlined"
                                                    type="submit"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                >
                                                    {t("submit")}
                                                </Button>
                                            )}
                                        </>
                                    )}
                            </>
                        }
                    >
                        <Button
                            id={buildID(parentId, ids.ADD_BUTTON)}
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={onAddonsSelected}
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
                            handleRemoveAddon={handleRemoveAddon}
                            onAddonsSelected={onAddonsSelected}
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
        handleRemoveAddon,
        isFetchingSubAddons,
        onAddonsSelected,
        parentId,
        resetForm,
    } = props;

    const { t } = useTranslation("subscriptions");
    const classes = useStyles();
    return (
        <>
            <Table className={classes.table}>
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
                                handleRemoveAddon={handleRemoveAddon}
                                isFetchingSubAddons={isFetchingSubAddons}
                                onAddonsSelected={onAddonsSelected}
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
    const { addons, handleRemoveAddon, isFetchingSubAddons, name, parentId } =
        props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");
    const tableId = buildID(parentId, ids.SUB_ADDONS.EDIT_ADDONS_TABLE);
    const classes = useStyles();
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
                                    <TableCell className={classes.tableCell}>
                                        <IconButton
                                            aria-label={t(
                                                "removeAddonAriaLabel"
                                            )}
                                            size="small"
                                            onClick={() =>
                                                handleRemoveAddon(addonUUID)
                                            }
                                        >
                                            <Remove />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Typography>
                                            {item.addon.name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        className={`${classes.tableCell} ${classes.alignRight}`}
                                        width="40%"
                                    >
                                        <Field
                                            name={`${name}.${index}.amount`}
                                            component={FormNumberField}
                                            id={ids.SUB_ADDONS.NAME_FIELD}
                                            required
                                            validate={(value) =>
                                                nonZeroValue(value, i18nUtil)
                                            }
                                            inputProps={{
                                                className: classes.alignRight,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Typography>
                                            {resourceInBytes
                                                ? "GiB"
                                                : item.addon.resource_type.unit}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Field
                                            name={`${name}.${index}.paid`}
                                            component={FormCheckbox}
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
