import React from "react";

import { useTranslation } from "i18n";

import { DeleteBtn, StyledAddBtn } from "../Buttons";
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
import { Field, getIn } from "formik";
import {
    Table,
    TableBody,
    TableCell,
    Toolbar,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

const TABLE_COLUMNS = [
    { name: "Host Path", numeric: false, enableSorting: false },
    { name: "Container Path", numeric: false, enableSorting: false },
    { name: "", numeric: false, enableSorting: false, key: "remove" },
];

function ContainerVolumes(props) {
    const {
        name,
        parentId,
        push,
        remove,
        form: { values, errors, touched },
    } = props;

    const { t } = useTranslation("tools");

    let volumes = getIn(values, name);
    let hasErrors = !!getFormError(name, touched, errors);

    return (
        <SimpleExpansionPanel
            header={t("containerVolumes")}
            parentId={parentId}
            defaultExpanded={!!volumes && volumes.length > 0}
            hasErrors={hasErrors}
        >
            <Toolbar>
                <StyledAddBtn
                    onClick={() => push({ host_path: "", container_path: "" })}
                    parentId={parentId}
                />
                <Typography variant="subtitle1">{t("volume")}</Typography>
            </Toolbar>
            <Table>
                <TableBody>
                    {(!volumes || volumes.length === 0) && (
                        <EmptyTable
                            message={t("noContainerVolumes")}
                            numColumns={TABLE_COLUMNS.length}
                        />
                    )}
                    {volumes &&
                        volumes.length > 0 &&
                        volumes.map((port, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.host_path`}
                                        id={build(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.HOST_PATH
                                        )}
                                        fullWidth={false}
                                        label={t("hostPath")}
                                        required
                                        validate={nonEmptyField}
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.container_path`}
                                        id={build(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.CONTAINER_PATH
                                        )}
                                        fullWidth={false}
                                        label={t("containerPath")}
                                        required
                                        validate={nonEmptyField}
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteBtn
                                        onClick={() => remove(index)}
                                        parentId={build(parentId, index)}
                                    />
                                </TableCell>
                            </DERow>
                        ))}
                </TableBody>
                <EnhancedTableHead
                    selectable={false}
                    rowCount={volumes ? volumes.length : 0}
                    baseId={parentId}
                    ids={ids.PORTS_TABLE}
                    columnData={TABLE_COLUMNS}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

ContainerVolumes.propTypes = {
    name: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    form: PropTypes.shape({
        values: PropTypes.object.isRequired,
    }),
};

export default ContainerVolumes;
