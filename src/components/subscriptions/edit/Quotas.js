import React from "react";

import { useTranslation } from "i18n";
import { Field, getIn } from "formik";
import ids from "../ids";

import { Table, TableBody, TableCell, Typography } from "@material-ui/core";
import SimpleExpansionPanel from "components/utils/SimpleExpansionPanel";

import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";
import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";
import FormNumberField from "components/forms/FormNumberField";
import { nonZeroValue } from "components/utils/validations";

const TABLE_COLUMNS = [
    { name: "Quota", numeric: true, enableSorting: false },
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
                        quotas.map((quota, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell
                                    style={{ textAlign: "right" }}
                                    width="50%"
                                >
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
                                            nonZeroValue(value, i18nUtil)
                                        }
                                        component={FormNumberField}
                                        inputProps={{
                                            style: { textAlign: "right" },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <QuotaResourceType
                                        quota={quota}
                                        index={index}
                                        t={t}
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

function QuotaResourceType(props) {
    const { index, quota, t } = props;
    let resourceInBytes = quota.resource_type.unit.toLowerCase() === "bytes";
    if (resourceInBytes) {
        return <Typography key={index}>{t("gib")}</Typography>;
    } else {
        return <Typography key={index}>{quota.resource_type.unit}</Typography>;
    }
}

export default Quotas;
