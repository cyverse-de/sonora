import React from "react";
import { useTranslation } from "i18n";

import { DeleteBtn, AddBtn } from "../Buttons";
import ids from "../ids";
import SimpleExpansionPanel from "components/utils/SimpleExpansionPanel";
import { nonEmptyField } from "components/utils/validations";

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";

import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";
import FormCheckbox from "components/forms/FormCheckbox";
import FormTextField from "components/forms/FormTextField";
import getFormError from "components/forms/getFormError";

import { Field, getIn } from "formik";
import {
    Table,
    TableBody,
    TableCell,
    Toolbar,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const TABLE_COLUMNS = [
    { name: "Name", numeric: false, enableSorting: false },
    { name: "Name Prefix", numeric: false, enableSorting: false },
    { name: "Tag", numeric: false, enableSorting: false },
    { name: "URL", numeric: false, enableSorting: false },
    { name: "Read Only", numeric: false, enableSorting: false },
    { name: "", numeric: false, enableSorting: false, key: "remove" },
];

function ContainerVolumesFrom(props) {
    const {
        name,
        parentId,
        push,
        remove,
        form: { values, errors, touched },
    } = props;

    const { t } = useTranslation("tools");
    const { t: i18nUtil } = useTranslation("util");

    let volumesFrom = getIn(values, name);
    let hasErrors = !!getFormError(name, touched, errors);

    return (
        <SimpleExpansionPanel
            header={t("containerVolumesFrom")}
            parentId={parentId}
            defaultExpanded={!!volumesFrom && volumesFrom.length > 0}
            hasErrors={hasErrors}
        >
            <Toolbar>
                <AddBtn
                    onClick={() =>
                        push({
                            name: "",
                            name_prefix: "",
                            tag: "",
                            url: "",
                            read_only: true,
                        })
                    }
                    parentId={parentId}
                />
                <Typography variant="subtitle1">{t("volumeFrom")}</Typography>
            </Toolbar>
            <Table>
                <TableBody>
                    {(!volumesFrom || volumesFrom.length === 0) && (
                        <EmptyTable
                            message={t("noContainerVolumesFrom")}
                            numColumns={TABLE_COLUMNS.length}
                        />
                    )}
                    {volumesFrom &&
                        volumesFrom.length > 0 &&
                        volumesFrom.map((port, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.name`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.NAME
                                        )}
                                        fullWidth={false}
                                        label={t("name")}
                                        required
                                        validate={(value) =>
                                            nonEmptyField(value, i18nUtil)
                                        }
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.name_prefix`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.NAME_PREFIX
                                        )}
                                        fullWidth={false}
                                        label={t("namePrefix")}
                                        required
                                        validate={(value) =>
                                            nonEmptyField(value, i18nUtil)
                                        }
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.tag`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.TAG
                                        )}
                                        fullWidth={false}
                                        label={t("tag")}
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.url`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.DOCKER_URL
                                        )}
                                        fullWidth={false}
                                        label={t("url")}
                                        component={FormTextField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.read_only`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_TOOL_DLG.READ_ONLY
                                        )}
                                        label={t("readOnly")}
                                        component={FormCheckbox}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteBtn
                                        onClick={() => remove(index)}
                                        parentId={buildID(parentId, index)}
                                    />
                                </TableCell>
                            </DERow>
                        ))}
                </TableBody>
                <DETableHead
                    selectable={false}
                    rowCount={volumesFrom ? volumesFrom.length : 0}
                    baseId={parentId}
                    ids={ids.PORTS_TABLE}
                    columnData={TABLE_COLUMNS}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

ContainerVolumesFrom.propTypes = {
    name: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    form: PropTypes.shape({
        values: PropTypes.object.isRequired,
    }),
};

export default ContainerVolumesFrom;
