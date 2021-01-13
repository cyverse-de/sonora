import React, { Fragment } from "react";

import { useTranslation } from "i18n";

import { DeleteBtn, AddBtn } from "../Buttons";
import ids from "../ids";
import SimpleExpansionPanel from "../SimpleExpansionPanel";
import { minValue, nonEmptyMinValue } from "./Validations";
import { DERow } from "components/utils/DERow";

import {
    build,
    EmptyTable,
    EnhancedTableHead,
    FormCheckbox,
    FormNumberField,
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

function getTableColumns(isAdmin) {
    let tableColumns = [
        { name: "Container Port", numeric: false, enableSorting: false },
        {
            name: "",
            numeric: false,
            enableSorting: false,
            key: "remove",
        },
    ];

    if (isAdmin) {
        tableColumns.splice(1, 0, {
            name: "Bind to Host",
            numeric: false,
            enableSorting: false,
        });
        tableColumns.splice(1, 0, {
            name: "Host Port",
            numeric: false,
            enableSorting: false,
        });
    }

    return tableColumns;
}

function ContainerPorts(props) {
    const {
        name,
        isAdmin,
        parentId,
        push,
        remove,
        form: { values, errors },
    } = props;

    const { t } = useTranslation("tools");

    let ports = getIn(values, name);
    let hasErrors = !!getIn(errors, name);

    const tableColumns = getTableColumns(isAdmin);

    return (
        <SimpleExpansionPanel
            header={t("containerPorts")}
            parentId={parentId}
            defaultExpanded={!!ports && ports.length > 0}
            hasErrors={hasErrors}
        >
            <Toolbar>
                <AddBtn
                    onClick={() => push({ container_port: "" })}
                    parentId={parentId}
                />
                <Typography variant="subtitle1">{t("port")}</Typography>
            </Toolbar>
            <Table>
                <TableBody>
                    {(!ports || ports.length === 0) && (
                        <EmptyTable
                            message={t("noContainerPorts")}
                            numColumns={tableColumns.length}
                        />
                    )}
                    {ports &&
                        ports.length > 0 &&
                        ports.map((port, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.container_port`}
                                        id={build(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.CONTAINER_PORT
                                        )}
                                        label={t("portNumber")}
                                        required
                                        validate={(value) =>
                                            nonEmptyMinValue(value, t)
                                        }
                                        component={FormNumberField}
                                    />
                                </TableCell>
                                {isAdmin && (
                                    <Fragment>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.host_port`}
                                                id={build(
                                                    parentId,
                                                    index,
                                                    ids.EDIT_TOOL_DLG.HOST_PORT
                                                )}
                                                label={t("portNumber")}
                                                validate={(value) =>
                                                    minValue(value, t)
                                                }
                                                component={FormNumberField}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                name={`${name}.${index}.bind_to_host`}
                                                id={build(
                                                    parentId,
                                                    index,
                                                    ids.EDIT_TOOL_DLG
                                                        .BIND_TO_HOST
                                                )}
                                                label={t("bindToHost")}
                                                required
                                                validate={(value) =>
                                                    minValue(value, t)
                                                }
                                                component={FormCheckbox}
                                            />
                                        </TableCell>
                                    </Fragment>
                                )}
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
                    rowCount={ports ? ports.length : 0}
                    baseId={parentId}
                    ids={ids.PORTS_TABLE}
                    columnData={tableColumns}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

ContainerPorts.propTypes = {
    name: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    parentId: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    form: PropTypes.shape({
        values: PropTypes.object.isRequired,
    }),
};

export default ContainerPorts;
