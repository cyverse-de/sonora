import React from "react";
import { useTranslation } from "i18n";

import { AddBtn, DeleteBtn } from "../Buttons";
import ids from "../ids";
import SimpleExpansionPanel from "components/utils/SimpleExpansionPanel";
import { nonEmptyField } from "components/utils/validations";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";

import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";
import FormTextField from "components/forms/FormTextField";
import getFormError from "components/forms/getFormError";
import { Field, getIn } from "formik";
import {
    Table,
    TableBody,
    TableCell,
    Toolbar,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

const getColumns = (t) => [
    { name: t("hostPath"), numeric: false, enableSorting: false },
    { name: t("containerPath"), numeric: false, enableSorting: false },
    { name: "", numeric: false, enableSorting: false, key: "remove" },
];

function ContainerDevices(props) {
    const {
        name,
        parentId,
        push,
        remove,
        form: { values, errors, touched },
    } = props;
    const { t } = useTranslation("tools");
    const { t: i18nUtil } = useTranslation("util");

    let devices = getIn(values, name);
    let hasErrors = !!getFormError(name, touched, errors);

    return (
        <SimpleExpansionPanel
            header={t("containerDevices")}
            parentId={parentId}
            defaultExpanded={!!devices && devices.length > 0}
            hasErrors={hasErrors}
        >
            <Toolbar>
                <AddBtn
                    onClick={() => push({ host_path: "", container_path: "" })}
                    parentId={parentId}
                />
                <Typography variant="subtitle1">{t("device")}</Typography>
            </Toolbar>
            <Table>
                <TableBody>
                    {(!devices || devices.length === 0) && (
                        <EmptyTable
                            message={t("noContainerDevices")}
                            numColumns={getColumns(t).length}
                        />
                    )}
                    {devices &&
                        devices.length > 0 &&
                        devices.map((port, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.host_path`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.HOST_PATH
                                        )}
                                        fullWidth={false}
                                        label={t("hostPath")}
                                        required
                                        validate={(value) =>
                                            nonEmptyField(value, i18nUtil)
                                        }
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.container_path`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.CONTAINER_PATH
                                        )}
                                        fullWidth={false}
                                        label={t("containerPath")}
                                        required
                                        validate={(value) =>
                                            nonEmptyField(value, i18nUtil)
                                        }
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteBtn
                                        parentId={buildID(parentId, index)}
                                        onClick={() => remove(index)}
                                    />
                                </TableCell>
                            </DERow>
                        ))}
                </TableBody>
                <DETableHead
                    selectable={false}
                    rowCount={devices ? devices.length : 0}
                    baseId={parentId}
                    ids={ids.PORTS_TABLE}
                    columnData={getColumns(t)}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

ContainerDevices.propTypes = {
    name: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    form: PropTypes.shape({
        values: PropTypes.object.isRequired,
    }),
};

export default ContainerDevices;
