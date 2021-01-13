import React from "react";
import { useTranslation } from "i18n";

import { DeleteBtn, AddBtn } from "../Buttons";
import ids from "../ids";
import SimpleExpansionPanel from "../SimpleExpansionPanel";
import { nonEmptyField } from "./Validations";
import { DERow } from "components/utils/DERow";

import {
    build,
    EmptyTable,
    EnhancedTableHead,
    FormTextField,
    getFormError,
} from "@cyverse-de/ui-lib";
import { Field, FieldArray, getIn } from "formik";
import {
    Table,
    TableBody,
    TableCell,
    Toolbar,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

const TABLE_COLUMNS = [
    { name: "File Name(s)", numeric: false, enableSorting: false },
    { name: "", numeric: false, enableSorting: false, key: "remove" },
];

function TestFiles(props) {
    const {
        name,
        header,
        parentId,
        push,
        remove,
        form: { values, errors, touched },
    } = props;

    const { t } = useTranslation("tools");

    let files = getIn(values, name);
    let hasErrors = !!getFormError(name, touched, errors);

    return (
        <SimpleExpansionPanel
            header={header}
            parentId={parentId}
            defaultExpanded={!!files && files.length > 0}
            hasErrors={hasErrors}
        >
            <Toolbar>
                <AddBtn parentId={parentId} onClick={() => push("")} />
                <Typography variant="subtitle1">{t("add")}</Typography>
            </Toolbar>
            <Table>
                <TableBody>
                    {(!files || files.length === 0) && (
                        <EmptyTable
                            message={t("noFiles")}
                            numColumns={TABLE_COLUMNS.length}
                        />
                    )}
                    {files &&
                        files.length > 0 &&
                        files.map((path, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}`}
                                        fullWidth={false}
                                        id={build(parentId, index)}
                                        label={t("fileName")}
                                        required
                                        validate={nonEmptyField}
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteBtn
                                        parentId={build(parentId, index)}
                                        onClick={() => remove(index)}
                                    />
                                </TableCell>
                            </DERow>
                        ))}
                </TableBody>
                <EnhancedTableHead
                    selectable={false}
                    rowCount={files ? files.length : 0}
                    baseId={parentId}
                    ids={ids.PORTS_TABLE}
                    columnData={TABLE_COLUMNS}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

function ToolImplementation(props) {
    const {
        field: { name },
        form: { errors, touched },
        isAdmin,
        parentId,
    } = props;

    const { t } = useTranslation("tools");

    let hasErrors = !!getFormError(name, touched, errors);

    return (
        <SimpleExpansionPanel
            header={t("toolImplementation")}
            parentId={parentId}
            hasErrors={hasErrors}
        >
            <Field
                name={`${name}.implementor`}
                label={t("implementor")}
                id={build(parentId, ids.EDIT_TOOL_DLG.IMPLEMENTOR)}
                required
                validate={(value) => isAdmin && nonEmptyField(value)}
                component={FormTextField}
            />
            <Field
                name={`${name}.implementor_email`}
                label={t("implementorEmail")}
                id={build(parentId, ids.EDIT_TOOL_DLG.IMPLEMENTOR_EMAIL)}
                required
                validate={(value) => isAdmin && nonEmptyField(value)}
                component={FormTextField}
            />
            <FieldArray
                name={`${name}.test.input_files`}
                render={({ ...props }) => (
                    <TestFiles
                        {...props}
                        header={t("sampleInputFiles")}
                        parentId={build(
                            parentId,
                            ids.EDIT_TOOL_DLG.SAMPLE_INPUT_FILES
                        )}
                    />
                )}
            />
            <FieldArray
                name={`${name}.test.output_files`}
                render={({ ...props }) => (
                    <TestFiles
                        {...props}
                        header={t("sampleOutputFiles")}
                        parentId={build(
                            parentId,
                            ids.EDIT_TOOL_DLG.SAMPLE_OUTPUT_FILES
                        )}
                    />
                )}
            />
        </SimpleExpansionPanel>
    );
}

ToolImplementation.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    parentId: PropTypes.string.isRequired,
};

export default ToolImplementation;
