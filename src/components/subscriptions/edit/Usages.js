import React from "react";

import { useTranslation } from "i18n";
import { Field, getIn } from "formik";
import { Table, TableBody, TableCell } from "@material-ui/core";
import SimpleExpansionPanel from "../SimpleExpansionPanel";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";

import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

import EmptyTable from "components/table/EmptyTable";
import FormTextField from "components/forms/FormTextField";
import FormNumberField from "components/forms/FormNumberField";

const TABLE_COLUMNS = [
    { name: "Usage", numeric: true, enableSorting: false, align: "right" },
    { name: "Unit", numeric: false, enableSorting: false },
];

function Usages(props) {
    const {
        name,
        parentId,
        form: { values },
    } = props;
    const { t } = useTranslation("subscriptions");

    let usages = getIn(values, name);
    return (
        <SimpleExpansionPanel header={t("usages")} defaultExpanded={false}>
            <Table>
                <TableBody>
                    {(!usages || usages.length === 0) && (
                        <EmptyTable
                            message={t("noUsages")}
                            numColumns={TABLE_COLUMNS.length}
                        />
                    )}
                    {usages &&
                        usages.length > 0 &&
                        usages.map((_, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.usage`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_SUB_DLG.USAGES
                                        )}
                                        fullWidth={false}
                                        disabled
                                        component={FormNumberField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.resource_type.unit`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_SUB_DLG
                                                .USAGES_RESOURCE_TYPE
                                        )}
                                        fullWidth={false}
                                        disabled
                                        component={FormTextField}
                                    />
                                </TableCell>
                            </DERow>
                        ))}
                </TableBody>
                <DETableHead
                    selectable={false}
                    rowCount={usages ? usages.length : 0}
                    baseId={parentId}
                    ids={ids.USAGES_TABLE}
                    columnData={TABLE_COLUMNS}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

export default Usages;
