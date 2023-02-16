import React from "react";

import { useTranslation } from "i18n";
import { Field, getIn } from "formik";
import ids from "../ids";

import { Table, TableBody, TableCell } from "@material-ui/core";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";
import FormTextField from "components/forms/FormTextField";
import FormNumberField from "components/forms/FormNumberField";
import { nonEmptyMinValue } from "components/utils/validations";

const TABLE_COLUMNS = [
    { name: "Quota", numeric: false, enableSorting: false },
    { name: "Name", numeric: false, enableSorting: false },
];

function Quotas(props) {
    const {
        name,
        parentId,
        subscription,
        form: { values },
    } = props;
    const { t } = useTranslation("subscriptions");
    const { t: i18nUtil } = useTranslation("util");
    const resourceTypes = [];
    subscription.quotas.forEach((resource) => {
        resourceTypes.push(resource.resource_type?.name);
    });
    let quotas = getIn(values, name);
    return (
        <SimpleExpansionPanel
            parentId={parentId}
            header={t("quotas")}
            defaultExpanded={true}
        >
            <Table>
                <TableBody>
                    {(!resourceTypes || resourceTypes.length === 0) && (
                        <EmptyTable
                            message={t("noQuotas")}
                            numColumns={TABLE_COLUMNS.length}
                        />
                    )}
                    {quotas &&
                        quotas.length > 0 &&
                        quotas.map((_, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.quota`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_QUOTAS_DLG.QUOTAS
                                        )}
                                        fullWidth={false}
                                        required
                                        validate={(value) =>
                                            nonEmptyMinValue(value, i18nUtil)
                                        }
                                        component={FormNumberField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Field
                                        name={`${name}.${index}.resource_type.unit`}
                                        id={buildID(
                                            parentId,
                                            index,
                                            ids.EDIT_QUOTAS_DLG
                                                .QUOTAS_RESOURCE_TYPE
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
                    rowCount={quotas ? quotas.length : 0}
                    baseId={parentId}
                    ids={ids.QUOTAS_TABLE}
                    columnData={TABLE_COLUMNS}
                />
            </Table>
        </SimpleExpansionPanel>
    );
}

export default Quotas;
