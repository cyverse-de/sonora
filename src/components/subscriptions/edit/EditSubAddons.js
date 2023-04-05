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
    Tooltip,
    Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Close, Delete, Edit, Save } from "@material-ui/icons";

import DEDialog from "components/utils/DEDialog";
import buildID from "components/utils/DebugIDUtil";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import EmptyTable from "components/table/EmptyTable";
import FormNumberField from "components/forms/FormNumberField";
import FormCheckbox from "components/forms/FormCheckbox";
import TableLoading from "components/table/TableLoading";

import {
    putSubAddon,
    SUBSCRIPTION_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";
import { announce } from "components/announcer/CyVerseAnnouncer";

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
    const [fieldsDisabled, setFieldsDisabled] = useState(true);
    const [buttonsVisible, setButtonsVisible] = useState(false);
    const [selectedAddon, setSelectedAddon] = useState(null);

    const { mutate: updateSubAddon } = useMutation(
        (submission) =>
            putSubAddon(subscriptionId, selectedAddon.uuid, submission),
        {
            onSuccess: (data) => {
                announce({ text: "FIX" });
                //onClose();
                queryClient.invalidateQueries(SUBSCRIPTION_ADDONS_QUERY_KEY);
                resetState();
            },
        }
    );

    // Handle when the edit icon button is clicked
    const handleEdit = (addon) => {
        setSelectedAddon(addon);
        setFieldsDisabled(false);
        setButtonsVisible(true);
    };

    // Handle when the submit icon button is clicked
    const handleSubmit = (values) => {
        updateSubAddon(formatUpdatedAddonSubmission(values, selectedAddon));
    };
    // Handle when the cancel icon button is clicked
    const handleCancel = () => {
        resetState();
    };

    const resetState = () => {
        setSelectedAddon(null);
        setFieldsDisabled(true);
        setButtonsVisible(false);
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
                                    {t("close")}
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
                        <EditSubAddonsForm
                            addons={selectedSubscriptionAddons}
                            buttonsVisible={buttonsVisible}
                            fieldsDisabled={fieldsDisabled}
                            handleCancel={handleCancel}
                            handleEdit={handleEdit}
                            handleSubmit={handleSubmit}
                            onAddAddonsSelected={onAddAddonsSelected}
                            isFetchingSubAddons={isFetchingSubAddons}
                            resetForm={resetForm}
                            parentId={parentId}
                            selectedAddon={selectedAddon}
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
        buttonsVisible,
        fieldsDisabled,
        handleCancel,
        handleEdit,
        handleSubmit,
        isFetchingSubAddons,
        onAddAddonsSelected,
        parentId,
        resetForm,
        selectedAddon,
    } = props;
    return (
        <>
            {addons && (
                <FieldArray
                    name={"addons"}
                    render={(arrayHelpers) => (
                        <Addons
                            parentId={buildID(
                                parentId,
                                ids.ADDONS.EDIT_SUB_ADDONS
                            )}
                            addons={addons}
                            buttonsVisible={buttonsVisible}
                            fieldsDisabled={fieldsDisabled}
                            handleCancel={handleCancel}
                            handleEdit={handleEdit}
                            handleSubmit={handleSubmit}
                            isFetchingSubAddons={isFetchingSubAddons}
                            onAddAddonsSelected={onAddAddonsSelected}
                            resetForm={resetForm}
                            selectedAddon={selectedAddon}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
        </>
    );
}

function Addons(props) {
    const {
        addons,
        buttonsVisible,
        fieldsDisabled,
        handleCancel,
        handleEdit,
        handleSubmit,
        isFetchingSubAddons,
        name,
        parentId,
        resetForm,
        selectedAddon,
    } = props;
    const { t } = useTranslation("subscriptions");
    const tableId = buildID(parentId, ids.SUB_ADDONS.EDIT_ADDONS_TABLE);
    return (
        <>
            <Table>
                {(!addons || addons.length === 0) && (
                    <EmptyTable
                        message={t("noAddons")}
                        numColumns={TABLE_COLUMNS.length}
                    />
                )}
                <DETableHead
                    baseId={parentId}
                    columnData={TABLE_COLUMNS}
                    rowsInPage={addons ? addons.length : 0}
                    selectable={false}
                />
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
                                // UUID for the add-on tied to this subscription
                                let addonUUID = item.uuid;
                                let isSelected =
                                    selectedAddon?.uuid === addonUUID;
                                let hasSelectedAddon = !!selectedAddon;
                                return (
                                    <DERow tabIndex={-1} key={addonUUID}>
                                        <TableCell>
                                            <div style={{ display: "flex" }}>
                                                {buttonsVisible &&
                                                    isSelected && (
                                                        <SubmitButtonGroup
                                                            handleCancel={
                                                                handleCancel
                                                            }
                                                            handleSubmit={
                                                                handleSubmit
                                                            }
                                                            parentId={parentId}
                                                            resetForm={
                                                                resetForm
                                                            }
                                                        />
                                                    )}
                                                {!buttonsVisible &&
                                                    !hasSelectedAddon && (
                                                        <EditButtonGroup
                                                            addonItem={item}
                                                            handleEdit={
                                                                handleEdit
                                                            }
                                                            parentId={parentId}
                                                            resetForm={
                                                                resetForm
                                                            }
                                                        />
                                                    )}
                                            </div>
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
                                                    : item.addon.resource_type
                                                          .unit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.amount`}
                                                component={FormNumberField}
                                                disabled={
                                                    !isSelected ||
                                                    fieldsDisabled
                                                }
                                                fullWidth={false}
                                                id={ids.SUB_ADDONS.NAME_FIELD}
                                                required
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.paid`}
                                                component={FormCheckbox}
                                                disabled={
                                                    !isSelected ||
                                                    fieldsDisabled
                                                }
                                                id={ids.SUB_ADDONS.PAID_FIELD}
                                                required
                                            />
                                        </TableCell>
                                    </DERow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </>
    );
}

function EditButtonGroup(props) {
    const { addonItem, handleEdit } = props;
    return (
        <>
            <IconButton
                aria-label="fix with internationalization"
                onClick={() => handleEdit(addonItem)}
                size="small"
            >
                <Edit color="action"></Edit>
            </IconButton>
            <IconButton aria-label="fix with internationalization" size="small">
                <Delete
                    color="error"
                    onClick={() => {
                        console.log("Deleted");
                    }}
                ></Delete>
            </IconButton>
        </>
    );
}

function SubmitButtonGroup(props) {
    const { handleCancel, handleSubmit, parentId, resetForm } = props;
    const { t } = useTranslation("subscriptions");
    return (
        <>
            <Tooltip title={t("save")} id={buildID(parentId, ids.SAVE_BUTTON)}>
                <IconButton onClick={handleSubmit}>
                    <Save color="primary" />
                </IconButton>
            </Tooltip>
            <Tooltip
                title={t("cancel")}
                id={buildID(parentId, ids.CANCEL_BUTTON)}
            >
                <IconButton
                    onClick={() => {
                        handleCancel();
                        resetForm();
                    }}
                >
                    <Close color="error"></Close>
                </IconButton>
            </Tooltip>
        </>
    );
}

export default EditSubAddonsDialog;
