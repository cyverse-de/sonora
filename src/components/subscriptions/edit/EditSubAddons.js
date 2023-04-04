import React from "react";

import { mapSubAddonsPropsToValues } from "./formatters";
import ids from "../ids";

import { useTranslation } from "i18n";
import { FieldArray, Field, Form, Formik, getIn } from "formik";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import DEDialog from "components/utils/DEDialog";
import buildID from "components/utils/DebugIDUtil";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import EmptyTable from "components/table/EmptyTable";
import FormNumberField from "components/forms/FormNumberField";
import FormCheckbox from "components/forms/FormCheckbox";
import TableLoading from "components/table/TableLoading";

const TABLE_COLUMNS = [
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
    } = props;
    const { t } = useTranslation("subscriptions");

    return (
        <Formik
            initialValues={mapSubAddonsPropsToValues(
                selectedSubscriptionAddons
            )}
            enableReinitialize={true}
        >
            <Form>
                <DEDialog
                    id={parentId}
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    title={t("editAddons")}
                    actions={
                        <>
                            <Button
                                id={buildID(parentId, ids.CANCEL_BUTTON)}
                                variant="outlined"
                                onClick={onClose}
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
                        onAddAddonsSelected={onAddAddonsSelected}
                        isFetchingSubAddons={isFetchingSubAddons}
                        parentId={parentId}
                    />
                </DEDialog>
            </Form>
        </Formik>
    );
}

function EditSubAddonsForm(props) {
    const { addons, isFetchingSubAddons, onAddAddonsSelected, parentId } =
        props;
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
                            isFetchingSubAddons={isFetchingSubAddons}
                            onAddAddonsSelected={onAddAddonsSelected}
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
        form: { values },
        isFetchingSubAddons,
        name,
        parentId,
    } = props;
    const { t } = useTranslation("subscriptions");
    const addons = getIn(values, name);
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
                            addons.map((addon, index) => {
                                let resourceInBytes =
                                    addon.resource_type.toLowerCase() ===
                                    "bytes";
                                return (
                                    <DERow tabIndex={-1} key={index}>
                                        <TableCell>
                                            <Typography>
                                                {addon.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {resourceInBytes
                                                    ? "GiB"
                                                    : addon.resource_type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.amount`}
                                                component={FormNumberField}
                                                disabled
                                                fullWidth={false}
                                                id={ids.SUB_ADDONS.NAME_FIELD}
                                                required
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.paid`}
                                                component={FormCheckbox}
                                                disabled
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

export default EditSubAddonsDialog;
