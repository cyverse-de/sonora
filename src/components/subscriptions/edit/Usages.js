import React from "react";

import { useTranslation } from "i18n";
import { Table, TableBody, TableCell, Typography } from "@material-ui/core";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";
import { DERow } from "components/table/DERow";
import DETableHead from "components/table/DETableHead";

import ids from "../ids";

import EmptyTable from "components/table/EmptyTable";

const TABLE_COLUMNS = [
    { name: "Usage", numeric: false, enableSorting: false },
    { name: "Name", numeric: false, enableSorting: false },
];

function Usages(props) {
    const { parentId, usages } = props;
    const { t } = useTranslation("subscriptions");

    return (
        <SimpleExpansionPanel
            parentId={parentId}
            header={t("usages")}
            defaultExpanded={false}
        >
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
                        usages.map((resource, index) => (
                            <DERow tabIndex={-1} key={index}>
                                <TableCell>
                                    <Typography>{resource.usage}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {resource.resource_type.unit}
                                    </Typography>
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
